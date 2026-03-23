import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import * as handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import * as path from 'path';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import generateUniqueInvoiceId from 'src/utils/generate-facture-id';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: UserDTO) {
    // check user existance
    const exist = await this.prisma.user.findUnique({
      where: { email: createUserDto?.email },
    });
    if (exist) {
      throw new NotFoundException('User already registered !');
    }

    let userData = plainToClass(UserDTO, createUserDto);
    // hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData = {
      ...userData,
      password: hashedPassword,
    };
    // create user
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
    const data = await users?.map((user: any) => delete user?.password);
    return data;
  }

  async findAllProviders(query): Promise<any> {
    // Extract query params
    const { page = 1, limit = 10, verified, email }: any = query; // Set default values for page and limit

    // Define initial conditions
    const conditions: any = {
      roleId: 3,
    };

    // Add verified condition
    if (verified !== undefined) {
      conditions.verified = verified === 'true';
    }
    // Add email condition
    if (email) {
      conditions.email = { contains: email };
    }

    // Get total count of transporters
    const totalCount = await this.prisma.user.count({
      where: {
        ...conditions,
      },
    });

    // Fetch transporters with pagination
    let providers = await this.prisma.user.findMany({
      where: conditions,
      skip: (page - 1) * parseInt(limit), // Calculate skip value
      take: parseInt(limit),
    });
    providers = providers?.map((provider: any) => {
      delete provider?.password;
      delete provider?.resetPasswordToken;
      return provider;
    });
    // Return the result
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
        // roleId: USERROLES?.transporter?.id
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
    try {
      await this.mailerService.sendMail({
        to: updatedUser?.email,
        from: process.env.MAIL_FROM, // override default from
        subject: 'Welcome to Vanlog-express! Your Account is Approved',
        template: './user_verified',
        context: {
          companyName: updatedUser?.companyName
            ? updatedUser?.companyName
            : 'User',
          loginUrl: `${process.env.FRONTEND_URL}/login`,
          year: `${new Date()?.getFullYear()}`,
        },
      });
    } catch (error) {
      console.log('cannot send email to verify user !!!');
    }
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
    } else if (invoiceType === 4) {
      return ((pourcentage / 100) * priceTransporter).toFixed(2);
    } else {
      return null;
    }
  }

  async calcTTC(tva, priceClient, priceTransporter, invoiceType) {
    if (invoiceType === 3) {
      return tva + priceClient;
    } else if (invoiceType === 4) {
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
      // Read HTML template file
      const htmlPath = path.join(__dirname, '../../templates', template_name);
      const html = fs.readFileSync(htmlPath, 'utf-8');

      // Compile HTML template
      const template = handlebars.compile(html);

      // Inject data into template
      const compiledHtml = template(data);

      // Convert HTML to PDF buffer
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

      // Save generated PDF buffer in pdf file if save is true
      if (save) {
        const filePath = path.join(
          __dirname,
          '../../../generatedFiles',
          saved_file_name,
        );
      }

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  formatDate(date: any) {
    if (!date) return null; // Handle null/undefined cases

    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Handle invalid dates

    return d.toISOString().split('T')[0].split('-').reverse().join('-');
    // Converts '2025-02-13' → '13-02-2025'
  }

  async getProvidersInvoice(
    providerId: number,
    from: any,
    to: any,
    invoiceType: any,
    res: any,
  ) {
    try {
      // Fetch the provider's details from the database
      const user = await this.prisma.user.findUnique({
        where: { id: providerId },
      });
      console.log('providerId', { providerId, from, to });

      let userType: any = null; // To store the type of user (Client or Transporteur)
      const conditions: any = {}; // Conditions to filter orders

      // Determine the user type and set conditions based on the user's role
      if (user?.roleId == 3) {
        conditions.createdByUserId = providerId; // Filter orders created by the client
        userType = 'Client';
      } else if (user?.roleId == 2) {
        conditions.deliveredByUserId = providerId; // Filter orders delivered by the transporter
        userType = 'Transporteur';
      }

      // Add date range filters if provided
      if (from !== undefined) {
        conditions.startTransitAt = { gte: from }; // Orders starting on or after `from`
      }

      if (to !== undefined) {
        conditions.OR = [{ deliveredAt: { lte: to } }, { deliveredAt: null }]; // Orders delivered on or before `to` or not yet delivered
      }

      // Fetch orders matching the conditions
      const orders = await this.prisma.order.findMany({
        where: {
          orderStatusId: { in: [3, 4] }, // Only include orders with status 3 or 4
          ...conditions,
        },
      });

      // If no orders are found, return a 404 error
      if (!orders.length) {
        return res
          .status(404)
          .json({ message: 'No orders found for the given criteria' });
      }

      const timbreFiscale = 1.0; // Fixed stamp duty value
      const template_name =
        invoiceType == 3 ? 'facture-client.hbs' : 'facture-transporteur.hbs'; // Template for the invoice
      const saved_file_name = 'output.pdf'; // Name of the generated PDF file

      // Calculate total client price and transporter price for all orders
      const totalOrdersClientPrice = orders.reduce(
        (sum, ord) => sum + (+ord?.clientPrice || 0),
        0,
      );
      const totalOrdersTransporterPrice = orders.reduce(
        (sum, ord) => sum + (+ord?.transporterPrice || 0),
        0,
      );

      // Calculate TVA (VAT) based on the invoice type
      const tva = parseFloat(
        await this.calcTVA(
          7, // VAT rate (7%)
          totalOrdersClientPrice,
          totalOrdersTransporterPrice,
          invoiceType,
        ),
      ).toFixed(3);

      // Calculate TTC (Total including VAT)
      const ttc = parseFloat(
        await this.calcTTC(
          parseFloat(tva),
          totalOrdersClientPrice,
          totalOrdersTransporterPrice,
          invoiceType,
        ),
      ).toFixed(3);

      // Calculate the net amount (TTC + stamp duty)
      const net = (parseFloat(ttc) + timbreFiscale).toFixed(3);

      // Check if an invoice already exists for the same provider, date range, and type
      const existingInvoice = await this.prisma.order_invoice.findFirst({
        where: { generatedFor: providerId, from, to, invoiceType },
        include: { orders: true }, // Include associated orders
      });

      let generatedInvoice;

      if (existingInvoice) {
        // If an existing invoice is found, check for new orders
        const existingOrderIds = new Set(
          existingInvoice.orders.map((o: any) => o.id), // Get IDs of existing orders
        );
        const newOrders = orders.filter(
          (o: any) => !existingOrderIds.has(o.id), // Filter out orders already in the invoice
        );

        if (newOrders.length > 0) {
          // If there are new orders, recalculate totals for all orders (existing + new)
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

          // Update the existing invoice with new orders and recalculated totals
          generatedInvoice = await this.prisma.order_invoice.update({
            where: { id: existingInvoice.id },
            data: {
              totalHt: parseFloat(`${totalHt}`),
              tva: parseFloat(tva),
              ttc: parseFloat(ttc),
              timbreFiscale: timbreFiscale,
              net: parseFloat(net),
              orders: { connect: newOrders.map((o: any) => ({ id: o.id })) }, // Connect new orders to the invoice
            },
          });
        } else {
          // If no new orders are found, return the existing invoice
          generatedInvoice = existingInvoice;
        }
      } else {
        // If no existing invoice is found, generate a unique invoice number
        const genMatricule = await generateUniqueInvoiceId(this.prisma);

        // Create a new invoice
        generatedInvoice = await this.prisma.order_invoice.create({
          data: {
            matricule: genMatricule, // Unique invoice number
            totalHt: totalOrdersClientPrice, // Total HT (excluding VAT)
            tva: parseFloat(tva), // VAT amount
            ttc: parseFloat(ttc), // Total including VAT
            timbreFiscale: timbreFiscale, // Stamp duty
            net: parseFloat(net), // Net amount (TTC + stamp duty)
            invoiceType: invoiceType, // Invoice type (client or transporter)
            generatedBy: null, // ID of the user generating the invoice
            generatedFor: providerId, // ID of the provider
            from, // Start date of the invoice period
            to, // End date of the invoice period
            orders: { connect: orders.map((o: any) => ({ id: o.id })) }, // Connect orders to the invoice
          },
        });
      }

      // Generate the PDF invoice using the template and data
      const pdfBuffer = await this.generatePdf(
        {
          userType, // User type (Client or Transporteur)
          orders, // List of orders
          from: `${this.formatDate(from)?.split('T')[0]}`, // Formatted start date
          to: `${this.formatDate(to)?.split('T')[0]}`, // Formatted end date
          provider: {
            ...user,
            firstName: user?.firstName?.toUpperCase(),
            lastName: user?.lastName?.toUpperCase(),
            companyName: user?.companyName?.toUpperCase(),
          }, // Provider details
          ordersLength: orders.length, // Number of orders
          totalWeight: orders.reduce(
            (sum, ord) => sum + (+ord?.totalWeight || 0),
            0,
          ), // Total weight of all orders
          totalQuantity: orders.reduce(
            (sum, ord) => sum + (+ord?.totalQuantity || 0),
            0,
          ), // Total quantity of all orders
          totalOrdersPrice: orders.reduce(
            (sum, ord) => sum + (+ord?.totalPrice || 0),
            0,
          ), // Total price of all orders
          totalOrdersClientPrice, // Total client price
          totalOrdersTransporterPrice, // Total transporter price
          totalHeight: orders.reduce(
            (sum, ord) => sum + (+ord?.totalHeight || 0),
            0,
          ), // Total height of all orders
          totalWidth: orders.reduce(
            (sum, ord) => sum + (+ord?.totalWidth || 0),
            0,
          ), // Total width of all orders
          totalLength: orders.reduce(
            (sum, ord) => sum + (+ord?.totalLength || 0),
            0,
          ), // Total length of all orders
          tva, // VAT amount
          ttc, // Total including VAT
          timbreFiscale: parseFloat(`${timbreFiscale}`).toFixed(3), // Stamp duty
          net, // Net amount
          generatedInvoice: {
            ...generatedInvoice,
            createdAt: this.formatDate(generatedInvoice?.createdAt), // Formatted creation date
            from: this.formatDate(generatedInvoice?.from), // Formatted start date
            to: this.formatDate(generatedInvoice?.to), // Formatted end date
          }, // Invoice details
        },
        template_name, // Template name
        saved_file_name, // Output file name
        false, // Whether to save the file
      );

      // Set the response headers and send the PDF
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    } catch (error) {
      // Handle errors and return a 500 status code
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
