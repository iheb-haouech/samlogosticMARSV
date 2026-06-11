import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import * as handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import * as path from 'path';
import * as fs from 'fs';
import generateUniqueInvoiceId from '../utils/generate-facture-id';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createUserDto: UserDTO) {
    const exist = await this.prisma.user.findUnique({
      where: { email: createUserDto?.email },
    });

    if (exist) {
      throw new NotFoundException('User already registered !');
    }

    let userData = plainToClass(UserDTO, createUserDto);
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData = {
      ...userData,
      password: hashedPassword,
    };

    const createdUser = await this.prisma.user.create({
      data: {
        ...userData,
        disponibility: userData?.disponibility
          ? {
              create: userData?.disponibility,
            }
          : undefined,
      } as any,
      include: {
        disponibility: true,
      },
    });

    delete createdUser?.password;
    return createdUser;
  }

  async findAll(): Promise<any> {
    const users = await this.prisma.user.findMany();
    return users.map((user: any) => {
      delete user.password;
      delete user.resetPasswordToken;
      return user;
    });
  }

  async updateRoleAndScope(
    id: number,
    payload: {
      roleId?: number;
      adminManagedCities?: string[];
      isMainAdmin?: boolean;
      verified?: boolean;
      blocked?: boolean;
    },
  ): Promise<any> {
    const allowedRoles = [1, 2, 3, 4];

    if (payload.roleId && !allowedRoles.includes(Number(payload.roleId))) {
      throw new HttpException('Invalid role', 400);
    }

    const nextRoleId = payload.roleId;
    const isAdmin = nextRoleId === 1;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        roleId: nextRoleId,
        adminManagedCities: isAdmin ? (payload.adminManagedCities || []) : [],
        isMainAdmin: isAdmin ? !!payload.isMainAdmin : false,
        verified: payload.verified,
        blocked: payload.blocked,
      } as any,
    });

    delete updatedUser.password;
    delete updatedUser.resetPasswordToken;
    return updatedUser;
  }

  async findAllProviders(query): Promise<any> {
    const { page = 1, limit = 10, verified, email }: any = query;

    const conditions: any = {
      roleId: 3,
    };

    if (verified !== undefined) {
      conditions.verified = verified === 'true';
    }

    if (email) {
      conditions.email = { contains: email };
    }

    const totalCount = await this.prisma.user.count({
      where: {
        ...conditions,
      },
    });

    let providers = await this.prisma.user.findMany({
      where: conditions,
      skip: (page - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    providers = providers?.map((provider: any) => {
      delete provider?.password;
      delete provider?.resetPasswordToken;
      return provider;
    });

    console.log({
      totalCount,
      providers,
    });

    return {
      totalCount,
      providers,
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        createOrders: true,
        deliverOrders: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found !');
    }

    delete user?.password;
    return user;
  }

  async findProviderOrders(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        createOrders: {
          include: {
            source: true,
            recipient: true,
            packages: {
              include: {
                references: true,
              },
            },
            pods: true,
            order_invoice: true,
          },
        },
      },
    });

    delete user?.password;
    delete user?.resetPasswordToken;
    return user;
  }

  async getAllInvoices(query?: any) {
    const { from, to, userId } = query || {};

    return this.prisma.order_invoice.findMany({
      where: {
        ...(userId && { generatedFor: Number(userId) }),
        ...(from && to && {
          createdAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserOrdersInvoices(
    id: number,
    page: number = 1,
    limit: number = 12,
  ) {
    const skip = (page - 1) * limit;

    const invoices = await this.prisma.order_invoice.findMany({
      where: {
        generatedFor: id,
      },
      include: {
        orders: true,
      },
      skip,
      take: limit,
    });

    const totalCount = await this.prisma.order_invoice.count({
      where: {
        generatedFor: id,
      },
    });

    return {
      invoices,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async updateUserDisponibility(id: number, userDto: UserDTO): Promise<any> {
    const { disponibility } = userDto;

    const data = await this.prisma.user.update({
      where: { id },
      data: {
        disponibility: {
          update: disponibility,
        } as any,
      },
      include: {
        disponibility: true,
      },
    });

    return data;
  }

  async updateUser(id: number, userDto: UserDTO): Promise<any> {
    if (userDto?.password) {
      const hashedPassword = await bcrypt.hash(userDto?.password, 10);
      userDto = {
        ...userDto,
        password: hashedPassword,
      };
    } else {
      delete userDto.password;
    }

    const data = await this.prisma.user.update({
      where: { id },
      data: {
        ...userDto,
        disponibility: userDto?.disponibility
          ? {
              update: userDto?.disponibility,
            }
          : undefined,
      } as any,
      include: {
        disponibility: true,
      },
    });

    delete data?.password;
    return data;
  }

  async verifie(id: number) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        verified: true,
      } as any,
      include: {
        disponibility: true,
      },
    });

    delete updatedUser?.password;
    delete updatedUser?.resetPasswordToken;
    return updatedUser;
  }

  async removeUser(id: number): Promise<any> {
    const user: any = await this.findOne(id);

    if (!user) throw new HttpException('User not found !', 400);

    const deletedUser = await this.prisma.user.delete({ where: { id } });
    delete deletedUser?.password;
    return deletedUser;
  }

  async calcTVA(
    pourcentage: number,
    priceClient: number,
    priceTransporter: number,
    invoiceType: number,
  ): Promise<any> {
    if (invoiceType === 3) {
      return ((pourcentage / 100) * priceClient).toFixed(2);
    } else if (invoiceType === 2) {
      return ((pourcentage / 100) * priceTransporter).toFixed(2);
    } else {
      return null;
    }
  }

  async calcTTC(tva, priceClient, priceTransporter, invoiceType) {
    if (invoiceType === 3) {
      return tva + priceClient;
    } else if (invoiceType === 2) {
      return tva + priceTransporter;
    } else {
      return null;
    }
  }

  async generatePdf(
    data: any,
    template_name: string,
    saved_file_name: string,
    save: boolean = false,
  ): Promise<Buffer> {
    try {
      const htmlPath = path.join(__dirname, '../../templates', template_name);
      const html = fs.readFileSync(htmlPath, 'utf-8');
      const template = handlebars.compile(html);
      const compiledHtml = template(data);

      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        pdf.create(compiledHtml).toBuffer((err, buffer) => {
          if (err) {
            console.error('PDF Creation Error:', err);
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      });

      if (save) {
        path.join(__dirname, '../../../generatedFiles', saved_file_name);
      }

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  formatDate(date: any) {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString().split('T')[0].split('-').reverse().join('-');
  }

  async generateInvoiceData(
    providerId: number,
    from: any,
    to: any,
    invoiceType: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: providerId },
    });

    let conditions: any = {};
    let userType: string = '';

    if (user?.roleId == 3) {
      conditions.createdByUserId = providerId;
      userType = 'Client';
    } else if (user?.roleId == 2) {
      conditions.deliveredByUserId = providerId;
      userType = 'Transporteur';
    }

    if (from) conditions.startTransitAt = { gte: new Date(from) };
    if (to) conditions.deliveredAt = { lte: new Date(to) };

    const orders = await this.prisma.order.findMany({
      where: {
        orderStatusId: { in: [3, 4] },
        ...conditions,
      },
    });

    if (!orders.length) return null;

    const totalHt = orders.reduce(
      (sum, o) => sum + (+o.clientPrice || 0),
      0,
    );

    const tva = (totalHt * 0.07).toFixed(3);
    const ttc = (parseFloat(tva) + totalHt).toFixed(3);
    const net = (parseFloat(ttc) + 1).toFixed(3);

    return {
      user,
      orders,
      totalHt,
      tva,
      ttc,
      net,
      userType,
      from,
      to,
    };
  }

  async generateInvoicePdf(userId, from, to, type) {
    const data = await this.generateInvoiceData(userId, from, to, type);

    if (!data) {
      throw new NotFoundException('No data found for this invoice');
    }

    const template =
      type == 3 ? 'facture-client.hbs' : 'facture-transporteur.hbs';

    return this.generatePdf(data, template, 'invoice.pdf');
  }

  async getProvidersInvoice(
    providerId: number,
    from: any,
    to: any,
    invoiceType: any,
    res: any,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: providerId },
      });

      console.log('providerId', { providerId, from, to });

      let userType: any = null;
      const conditions: any = {};

      if (user?.roleId == 3) {
        conditions.createdByUserId = providerId;
        userType = 'Client';
      } else if (user?.roleId == 2) {
        conditions.deliveredByUserId = providerId;
        userType = 'Transporteur';
      }

      if (from) {
        conditions.startTransitAt = { gte: new Date(from) };
      }

      if (to) {
        conditions.deliveredAt = { lte: new Date(to) };
      }

      const orders = await this.prisma.order.findMany({
        where: {
          orderStatusId: { in: [3, 4] },
          ...conditions,
        },
      });

      if (!orders.length) {
        return res
          .status(404)
          .json({ message: 'No orders found for the given criteria' });
      }

      const timbreFiscale = 1.0;
      const template_name =
        invoiceType == 3 ? 'facture-client.hbs' : 'facture-transporteur.hbs';
      const saved_file_name = 'output.pdf';

      const totalOrdersClientPrice = orders.reduce(
        (sum, ord) => sum + (+ord?.clientPrice || 0),
        0,
      );

      const totalOrdersTransporterPrice = orders.reduce(
        (sum, ord) => sum + (+ord?.transporterPrice || 0),
        0,
      );

      const tva = parseFloat(
        await this.calcTVA(
          7,
          totalOrdersClientPrice,
          totalOrdersTransporterPrice,
          invoiceType,
        ),
      ).toFixed(3);

      const ttc = parseFloat(
        await this.calcTTC(
          parseFloat(tva),
          totalOrdersClientPrice,
          totalOrdersTransporterPrice,
          invoiceType,
        ),
      ).toFixed(3);

      const net = (parseFloat(ttc) + timbreFiscale).toFixed(3);

      const existingInvoice = await this.prisma.order_invoice.findFirst({
        where: { generatedFor: providerId, from, to, invoiceType },
        include: { orders: true },
      });

      let generatedInvoice;

      if (existingInvoice) {
        const existingOrderIds = new Set(
          existingInvoice.orders.map((o: any) => o.id),
        );

        const newOrders = orders.filter(
          (o: any) => !existingOrderIds.has(o.id),
        );

        if (newOrders.length > 0) {
          const allOrders = [...existingInvoice.orders, ...newOrders];
          const totalHt = allOrders.reduce(
            (sum, ord) => sum + (+ord?.clientPrice || 0),
            0,
          );

          const tva = parseFloat(
            await this.calcTVA(
              7,
              totalHt,
              totalOrdersTransporterPrice,
              invoiceType,
            ),
          ).toFixed(3);

          const ttc = parseFloat(
            await this.calcTTC(
              parseFloat(tva),
              totalHt,
              totalOrdersTransporterPrice,
              invoiceType,
            ),
          ).toFixed(3);

          const net = (parseFloat(ttc) + timbreFiscale).toFixed(3);

          generatedInvoice = await this.prisma.order_invoice.update({
            where: { id: existingInvoice.id },
            data: {
              totalHt: parseFloat(`${totalHt}`),
              tva: parseFloat(tva),
              ttc: parseFloat(ttc),
              timbreFiscale: timbreFiscale,
              net: parseFloat(net),
              orders: { connect: newOrders.map((o: any) => ({ id: o.id })) },
            },
          });
        } else {
          generatedInvoice = existingInvoice;
        }
      } else {
        const genMatricule = await generateUniqueInvoiceId(this.prisma);

        generatedInvoice = await this.prisma.order_invoice.create({
          data: {
            matricule: genMatricule,
            totalHt: totalOrdersClientPrice,
            tva: parseFloat(tva),
            ttc: parseFloat(ttc),
            timbreFiscale: timbreFiscale,
            net: parseFloat(net),
            invoiceType: invoiceType,
            generatedBy: null,
            generatedFor: providerId,
            from,
            to,
            orders: { connect: orders.map((o: any) => ({ id: o.id })) },
          },
        });
      }

      const pdfBuffer = await this.generatePdf(
        {
          userType,
          orders,
          from: `${this.formatDate(from)?.split('T')[0]}`,
          to: `${this.formatDate(to)?.split('T')[0]}`,
          provider: {
            ...user,
            firstName: user?.firstName?.toUpperCase(),
            lastName: user?.lastName?.toUpperCase(),
            companyName: user?.companyName?.toUpperCase(),
          },
          ordersLength: orders.length,
          totalWeight: orders.reduce(
            (sum, ord) => sum + (+ord?.totalWeight || 0),
            0,
          ),
          totalQuantity: orders.reduce(
            (sum, ord) => sum + (+ord?.totalQuantity || 0),
            0,
          ),
          totalOrdersPrice: orders.reduce(
            (sum, ord) => sum + (+ord?.totalPrice || 0),
            0,
          ),
          totalOrdersClientPrice,
          totalOrdersTransporterPrice,
          totalHeight: orders.reduce(
            (sum, ord) => sum + (+ord?.totalHeight || 0),
            0,
          ),
          totalWidth: orders.reduce(
            (sum, ord) => sum + (+ord?.totalWidth || 0),
            0,
          ),
          totalLength: orders.reduce(
            (sum, ord) => sum + (+ord?.totalLength || 0),
            0,
          ),
          tva,
          ttc,
          timbreFiscale: parseFloat(`${timbreFiscale}`).toFixed(3),
          net,
          generatedInvoice: {
            ...generatedInvoice,
            createdAt: this.formatDate(generatedInvoice?.createdAt),
            from: this.formatDate(generatedInvoice?.from),
            to: this.formatDate(generatedInvoice?.to),
          },
        },
        template_name,
        saved_file_name,
        false,
      );

      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
