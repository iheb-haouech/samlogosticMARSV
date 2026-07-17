import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderTransporterDto,
} from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { PackagesService } from '../packages/packages.service';
import generateCustomTrackingID from '../utils/generate-id';
import { USERROLES } from '../utils/enum';
import * as QRCode from 'qrcode';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private packagesService: PackagesService,
  ) {}

  private async ensureSeedData() {
    // Ensure order_status records exist
    await this.prisma.order_status.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, statusName: 'Created' },
    });
    await this.prisma.order_status.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, statusName: 'Pending' },
    });
    await this.prisma.order_status.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, statusName: 'In transit' },
    });
    await this.prisma.order_status.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, statusName: 'Delivered' },
    });
    await this.prisma.order_status.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, statusName: 'Canceled' },
    });
    await this.prisma.order_status.upsert({
      where: { id: 6 },
      update: {},
      create: { id: 6, statusName: 'Returned' },
    });

    // Ensure order_prices_status records exist
    await this.prisma.order_prices_status.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, statusName: 'No action' },
    });
    await this.prisma.order_prices_status.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, statusName: 'Waiting' },
    });
    await this.prisma.order_prices_status.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, statusName: 'Confirmed' },
    });
    await this.prisma.order_prices_status.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, statusName: 'Refused' },
    });
  }

  generateUniqueCustomID = async (user: any, sequence?: number) => {
    const nextSequence =
      sequence ??
      (await this.prisma.order.count({
        where: { createdByUserId: user?.id },
      })) + 1;
    const customID = generateCustomTrackingID(user, nextSequence);
    const exists = await this.prisma.order.findUnique({
      where: { trackingId: customID } as any,
    });
    if (exists) {
      return this.generateUniqueCustomID(user, nextSequence + 1);
    }
    return customID;
  };

  async create(userToken: string, createOrderDto: CreateOrderDto) {
    try {
      // Ensure required seed data exists
      await this.ensureSeedData();

      const orderData = plainToClass(CreateOrderDto, createOrderDto);
      // find who is the command creator id
      let user;
      if (orderData?.createdByUserId) {
        user = await this.prisma.user.findUnique({
          where: { id: orderData?.createdByUserId },
        });
      } else {
        // it is the user itself who will create the command
        const data = await this.authService.getAuthUser(userToken);
        user = data?.user;
      }

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user?.blocked) {
        throw new HttpException(
          'Compte bloque. Creation de commande non autorisee.',
          HttpStatus.FORBIDDEN,
        );
      }

      // Only admins/superadmins may set delivery/authoritative prices.
      // Determine the ACTUAL caller (from the token), not the order owner,
      // because an admin can create an order on behalf of a client.
      const caller = (await this.authService.getAuthUser(userToken))?.user;
      const callerIsAdmin =
        caller?.roleId === USERROLES.admin.id ||
        caller?.roleId === USERROLES.superadmin.id;
      if (!callerIsAdmin) {
        // Strip prices a client must never control.
        delete (orderData as any).transporterPrice;
        delete (orderData as any).clientPrice;
        delete (orderData as any).shipmentPrice;
      }

      if (user?.accountType === 'B2C') {
        if (orderData?.mainType && orderData.mainType !== 'national') {
          throw new HttpException(
            'Les comptes B2C peuvent creer uniquement des commandes nationales.',
            HttpStatus.BAD_REQUEST,
          );
        }
        orderData.mainType = 'national';

        const hasInvalidPackagePrice = orderData?.packages?.some(
          (packageData: any) => !packageData?.price || packageData.price <= 0,
        );
        if (hasInvalidPackagePrice) {
          throw new HttpException(
            'Le prix de chaque colis est obligatoire pour les comptes B2C.',
            HttpStatus.BAD_REQUEST,
          );
        }

        orderData.totalPrice =
          orderData?.packages?.reduce(
            (total: number, packageData: any) =>
              total + (packageData?.price || 0) * (packageData?.quantity || 1),
            0,
          ) || 0;

        if (orderData?.subType === 'envoieLegere') {
          orderData.shipmentPrice = 7;
        }
      }

      // Ensure default status IDs exist or use defaults
      const defaultOrderStatusId = 1;
      const defaultPriceStatusId = 1;

      // Generate a unique customID
      const customID = await this.generateUniqueCustomID(user);

      const packagesWithQr = await Promise.all(
        (orderData?.packages || []).map(async (packageData: any) => {
          const qrText = `${customID}-pkg${packageData?.id || Math.random().toString(36).slice(2, 8)}`;
          let qrDataUrl = '';
          try {
            qrDataUrl = await QRCode.toDataURL(qrText);
          } catch (err) {
            console.error('QR generation error on create:', err);
          }
          return {
            ...packageData,
            qrCode: qrText,
            references: {
              create: packageData?.references?.map(
                (referenceData: any) => referenceData,
              ),
            },
          };
        }),
      );

const createdOrder = await this.prisma.order.create({
        data: {
          ...orderData,
          trackingId: customID,
          createdByUserId: orderData?.createdByUserId
            ? orderData?.createdByUserId
            : user?.id,
          source: {
            create: orderData?.source,
          },
          recipient: {
            create: orderData?.recipient,
          },
          packages: {
            create: packagesWithQr,
          },
        },

        include: {
          source: true,
          recipient: true,
          packages: {
            include: {
              references: true,
            } as any,
          },
          pods: true,
          clientPriceStatus: true,
          transporterPriceStatus: true,
        },
      });

      return createdOrder;
    } catch (error: any) {
      console.error('Create order error:', error);
      const status = error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.message || 'Erreur lors de la création';
      throw new HttpException(message, status);
    }
  }

  async generateInvoiceAutomatically(order: any) {
  try {
    const providerId = order.createdByUserId;

    const from = order.startTransitAt;
    const to = order.deliveredAt;

    // 👉 call your existing logic
    await this.prisma.$transaction(async (prisma) => {
      const userService = new (require('../user/user.service').UserService)(
        prisma,
        null,
      );

      await userService.getProvidersInvoice(
        providerId,
        from,
        to,
        3,
        {
          status: () => ({ json: () => {} }),
          setHeader: () => {},
          send: () => {},
        },
      );
    });
  } catch (error) {
    console.error("Auto invoice error:", error);
  }
}

  async findAll(
    userToken: string,
    page: number,
    limit: number,
    trackingId: string,
    status: string,
  ) {
    let orders: any = [];
    let totalCount: number = 0;
    // find who creator id
    const { user } = await this.authService.getAuthUser(userToken);

    const offset = (page - 1) * limit;

    let conditions = {};
    if (trackingId !== 'null') {
      conditions = { ...conditions, trackingId: trackingId };
    }
    if (status !== 'null') {
      conditions = { ...conditions, orderStatusId: parseInt(status) };
    }
    if (user?.roleId === 1 || user?.roleId === 4) {
  // ADMIN / SUPERADMIN : voit toutes les commandes
  totalCount = await this.prisma.order.count({ where: conditions });
  orders = await this.prisma.order.findMany({
    where: conditions,
    include: {
      source: true,
      recipient: true,
      packages: {
        include: { references: true },
      },
      deliveredBy: {
        include: {
          disponibility: true,
          carType: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          companyName: true,
          firstName: true,
          lastName: true,
          email: true,
          accountType: true,
        },
      },
      pods: true,
      clientPriceStatus: true,
      transporterPriceStatus: true,
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
} else if (user?.roleId === 3) {
  // CLIENT : commandes qu'il a créées
  conditions = { ...conditions, createdByUserId: user.id };
  totalCount = await this.prisma.order.count({ where: conditions });
  orders = await this.prisma.order.findMany({
    where: conditions,
    include: {
      source: true,
      recipient: true,
      packages: {
        include: { references: true },
      },
      deliveredBy: {
        include: {
          disponibility: true,
          carType: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          companyName: true,
          firstName: true,
          lastName: true,
          email: true,
          accountType: true,
        },
      },
      pods: true,
      clientPriceStatus: true,
      transporterPriceStatus: true,
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
} else if (user?.roleId === 2) {
  // TRANSPORTEUR : commandes qui lui sont assignées
  conditions = { ...conditions, deliveredByUserId: user.id };
  totalCount = await this.prisma.order.count({ where: conditions });
  orders = await this.prisma.order.findMany({
    where: conditions,
    include: {
      source: true,
      recipient: true,
      packages: {
        include: { references: true },
      },
      deliveredBy: {
        include: {
          disponibility: true,
          carType: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          companyName: true,
          firstName: true,
          lastName: true,
          email: true,
          accountType: true,
        },
      },
      pods: true,
      clientPriceStatus: true,
      transporterPriceStatus: true,
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

    orders = await orders?.map((el: any) => {
      delete el?.deliveredBy?.password;
      return el;
    });
    return { orders, totalCount };
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id: id as any },
      include: {
        source: true,
        recipient: true,
        packages: {
          include: {
            references: true,
          },
        },
        pods: true,
        clientPriceStatus: true,
        transporterPriceStatus: true,
      },
    });
  }

  async findOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { trackingId: id as any },
      include: {
        source: true,
        recipient: true,
        packages: {
          include: {
            references: true,
          },
        },
        pods: true,
        deliveredBy: true,
        clientPriceStatus: true,
        transporterPriceStatus: true,
      },
    });
    delete order?.deliveredBy?.password;
    delete order?.deliveredBy?.resetPasswordToken;
    return order;
  }

  async update2(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const { source, recipient, packages, ...orderData } = updateOrderDto;

      if (id) {
        const updatedOrder = await this.prisma.order.update({
          where: { id: id },
          data: {
            ...orderData,
            source: source
              ? {
                  update: {
                    where: { orderId: id as any }, // Correct where clause for source update
                    data: source,
                  },
                }
              : undefined,
            recipient: recipient
              ? {
                  update: {
                    where: { orderId: id as any }, // Correct where clause for recipient update
                    data: recipient,
                  },
                }
              : undefined,
            packages: packages
              ? {
                  update: packages?.map((pkg) => ({
                    where: { id: pkg?.id },
                    data: {
                      ...pkg,
                      references: pkg?.references
                        ? {
                            update: pkg?.references?.map((ref) => ({
                              where: { id: ref?.id },
                              data: ref,
                            })),
                          }
                        : undefined,
                    },
                  })),
                }
              : undefined,
          },
          include: {
            source: true,
            recipient: true,
            packages: {
              include: {
                references: true,
              },
            },
            pods: true,
            clientPriceStatus: true,
            transporterPriceStatus: true,
          },
        });

        return updatedOrder;
      } else {
        throw new HttpException('Undefined Order ID !', 400);
      }
    } catch (error: any) {
      console.error(error?.message);
      return new HttpException(error?.message, 400);
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userToken?: string) {
    try {
      const { source, recipient, packages, ...orderData } = updateOrderDto;

      // Only admins/superadmins may change delivery/authoritative prices.
      const caller = (await this.authService.getAuthUser(userToken))?.user;
      const callerIsAdmin =
        caller?.roleId === USERROLES.admin.id ||
        caller?.roleId === USERROLES.superadmin.id;
      if (!callerIsAdmin) {
        delete (orderData as any).transporterPrice;
        delete (orderData as any).clientPrice;
        delete (orderData as any).shipmentPrice;
      }

      // Check if the order exists
      const orderExists = await this.prisma.order.findUnique({
        where: { id: id },
      });

      if (!orderExists) {
        throw new HttpException('Order not found', 404);
      }

      // Get all order packages
      const existsPackages = await this.prisma.order_packages.findMany({
        where: {
          orderId: id,
        },
      });

      // If packages are provided, handle package updates and deletions
      if (packages) {
        // Collect existing package IDs
        const existingPackageIds = existsPackages?.map((pkg) => pkg.id);

        // Check if there is a package not in the updateOrderDto to delete it
        const packagesToDelete = existsPackages?.filter((pkg) => {
          return !packages.some((updatePkg: any) => updatePkg?.id === pkg?.id);
        });

        // Delete packages not in updateOrderDto
        for (const pkg of packagesToDelete) {
          await this.prisma.order_packages.delete({
            where: {
              id: pkg?.id,
            },
          });
        }

        // Update or create packages
        for (const pkg of packages) {
          if (pkg?.references?.length === 0 || pkg?.references === undefined) {
            delete pkg?.references;
          }
          if (pkg.id && existingPackageIds.includes(pkg?.id)) {
            // Update package
            await this.packagesService.update(pkg?.id, pkg);
          } else {
            // Create package
            const newPkg = {
              ...pkg,
              orderId: id,
            };
            await this.packagesService.create(newPkg);
          }
        }
      }

      // Update order references
      await this.prisma.order.update({
        where: { id: id },
        data: {
          refrences: undefined,
        },
      });

      

      // Update order
      const updatedOrder = await this.prisma.order.update({
        where: { id: id },
        data: {
          ...orderData,
          source: source
            ? {
                update: {
                  where: { orderId: id as any }, // Correct where clause for source update
                  data: source,
                },
              }
            : undefined,
          recipient: recipient
            ? {
                update: {
                  where: { orderId: id as any }, // Correct where clause for recipient update
                  data: recipient,
                },
              }
            : undefined,
        },
        include: {
          source: true,
          recipient: true,
          packages: {
            include: {
              references: true,
            },
          },
          pods: true,
          deliveredBy: true,
          clientPriceStatus: true,
          transporterPriceStatus: true,
        },
      });

      return updatedOrder;
    } catch (error: any) {
      console.error(error?.message);
      return new HttpException(error?.message, error.status || 400);
    }
  }

  async updateOrderTransporter(
    id: string,
    updateOrderDto: UpdateOrderTransporterDto,
  ) {
    try {
      const { deliveredByUserId } = updateOrderDto;
      if (deliveredByUserId) {
        const transporter = await this.prisma.user.findUnique({
          where: { id: deliveredByUserId },
        });
        if (transporter?.blocked) {
          throw new HttpException(
            'Transporteur bloque. Assignation non autorisee.',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      const updatedOrder = await this.prisma.order.update({
        where: { id: id },
        data: {
          deliveredByUserId,
          orderStatusId: deliveredByUserId ? 2 : 1,
        } as any,
        include: {
          source: true,
          recipient: true,
          packages: {
            include: {
              references: true,
            },
          },
          pods: true,
          deliveredBy: true,
          clientPriceStatus: true,
          transporterPriceStatus: true,
        },
      });
      delete updatedOrder?.deliveredBy?.password;
      return updatedOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      return new HttpException(errorMessage, 400);
    }
  }

  async updateOrderStatus(userToken: string, id: any, orderData) {
  const { user } = await this.authService.getAuthUser(userToken);
  if (user?.blocked) {
    throw new HttpException(
      'Compte bloque. Mise a jour de commande non autorisee.',
      HttpStatus.FORBIDDEN,
    );
  }

  let data: any = { ...orderData };

  const existingOrder = await this.prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  if (user?.roleId === 2) {
    if (existingOrder.deliveredByUserId !== user.id) {
      throw new HttpException(
        'Commande non assignee a ce transporteur.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (![3, 4].includes(Number(data?.orderStatusId))) {
      throw new HttpException(
        'Le transporteur peut uniquement marquer la commande livree ou pas encore livree.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  if (!data?.orderStatusId) {
    data = { orderStatusId: 1 };
  }

  if (data?.orderStatusId == 3) {
    data = { ...data, startTransitAt: new Date() };
  }

  if (data?.orderStatusId == 4) {
    data = { ...data, deliveredAt: new Date() };
  }

  const updatedOrder = await this.prisma.order.update({
    where: { id: id },
    data: data as any,
    include: {
      source: true,
      recipient: true,
      packages: {
        include: {
          references: true,
        },
      },
      pods: true,
      deliveredBy: true,
      clientPriceStatus: true,
      transporterPriceStatus: true,
    },
  });

  if (updatedOrder.orderStatusId == 4 && existingOrder.orderStatusId !== 4) {
    const colisAmount = updatedOrder.totalPrice || 0;
    const transportAmount = updatedOrder.shipmentPrice || 0;
    const orderNote = updatedOrder.trackingId || updatedOrder.id;

    await this.prisma.$transaction(async (tx) => {
      const alreadyCredited = await tx.cashflow_transaction.findFirst({
        where: {
          note: orderNote,
          type: { in: ['ORDER_DELIVERED_CLIENT', 'ORDER_DELIVERED_TRANSPORTER'] },
        },
      });
      if (alreadyCredited) {
        return;
      }

      const creator = updatedOrder.createdByUserId
        ? await tx.user.findUnique({ where: { id: updatedOrder.createdByUserId } })
        : null;

      // B2C: client panier += prix colis uniquement (sans transport)
      if (
        creator?.accountType === 'B2C' &&
        updatedOrder.createdByUserId &&
        colisAmount > 0
      ) {
        await tx.user.update({
          where: { id: updatedOrder.createdByUserId },
          data: { walletBalance: { increment: colisAmount } },
        });
        await tx.cashflow_transaction.create({
          data: {
            userId: updatedOrder.createdByUserId,
            amount: colisAmount,
            type: 'ORDER_DELIVERED_CLIENT',
            note: orderNote,
          },
        });
      }

      // Transporteur: panier += colis + transport (argent collecte sur etiquette)
      const transporterAmount = colisAmount + transportAmount;
      if (updatedOrder.deliveredByUserId && transporterAmount > 0) {
        await tx.user.update({
          where: { id: updatedOrder.deliveredByUserId },
          data: { walletBalance: { increment: transporterAmount } },
        });
        await tx.cashflow_transaction.create({
          data: {
            userId: updatedOrder.deliveredByUserId,
            amount: transporterAmount,
            type: 'ORDER_DELIVERED_TRANSPORTER',
            note: orderNote,
          },
        });
      }
    });

    try {
      await this.generateInvoiceAutomatically(updatedOrder);
    } catch (error) {
      console.error("Invoice generation failed:", error);
    }
  }

  return updatedOrder;
}


async togglePaymentRequired(orderId: string, dto: { amount: number }) {
  return this.prisma.order.update({
    where: { id: orderId as any },
    data: {
      paymentRequired: true,
      paymentAmount: dto.amount,
      paymentStatus: 'pending'
    }
  });
}


async markPaid(orderId: string) {
  return this.prisma.order.update({
    where: { id: orderId as any },
    data: { paymentStatus: 'paid' }
  });
}

  remove(id: string) {
    return this.prisma.order.delete({ where: { id: id as any } });
  }
}
