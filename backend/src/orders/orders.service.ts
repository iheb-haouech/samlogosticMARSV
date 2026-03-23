import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderTransporterDto,
} from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { PackagesService } from 'src/packages/packages.service';
import generateCustomTrackingID from 'src/utils/generate-id';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private packagesService: PackagesService,
  ) {}

  generateUniqueCustomID = async (user: any) => {
    const customID = await generateCustomTrackingID(user);
    const exists = await this.prisma.order.findUnique({
      where: { trackingId: customID } as any,
    });
    if (exists) {
      // If customID already exists, recursively call itself to generate a new one
      return this.generateUniqueCustomID(user);
    }
    return customID; // Return unique customID
  };

  async create(userToken: string, createOrderDto: CreateOrderDto) {
    try {
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

      // Generate a unique customID
      const customID = await this.generateUniqueCustomID(user);
      console.log("ORDER DATA TO CREATE ===>", JSON.stringify(orderData, null, 2));
      console.log("USER USED ===>", user?.id);
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
            create: orderData?.packages?.map((packageData: any) => ({
              ...packageData,
              references: {
                create: packageData?.references?.map(
                  (referenceData: any) => referenceData,
                ),
              },
            })),
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
      console.error(error?.message);
      throw new HttpException(
      error?.message || 'Erreur lors de la création',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
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
    if (user?.roleId === 1) {
  // ADMIN : voit toutes les commandes
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const { source, recipient, packages, ...orderData } = updateOrderDto;

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
      console.error(error?.message);
      return new HttpException(error?.message, 400);
    }
  }

  async updateOrderStatus(id: any, orderData) {
    let data: any = { ...orderData };
    if (!data?.orderStatusId) {
      data = { orderStatusId: 1 };
    }
    // order is in transit = started
    if (data?.orderStatusId == 3) {
      data = { ...data, startTransitAt: new Date() };
    }
    // order is delivered
    if (data?.orderStatusId == 4) {
      data = { ...data, deliveredAt: new Date() };
    }
    // order is canceled
    if (data?.orderStatusId == 5) {
      data = { ...data };
    }
    return this.prisma.order.update({
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
