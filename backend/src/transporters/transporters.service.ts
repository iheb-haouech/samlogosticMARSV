import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { USERROLES } from 'src/utils/enum';

@Injectable()
export class TransportersService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  create(createTransporterDto: UserDTO) {
    return this.userService.create({
      ...createTransporterDto,
      roleId: USERROLES?.transporter?.id,
    });
  }

  async findAll(query) {
    // Extract query params
    const { page, limit, verified, firstName }: any = query;

    // Define initial conditions
    const conditions: any = {
      roleId: 2,
    };

    // Add verified condition
    if (verified !== undefined) {
      conditions.verified = verified === 'true';
    }
    // Add email condition
    if (firstName) {
      conditions.firstName = { contains: firstName };
    }

    // Get total count of transporters
    const totalCount = await this.prisma.user.count({
      where: {
        ...conditions,
      },
    });

    // Fetch transporters with pagination
    const transporters = await this.prisma.user.findMany({
      where: conditions,
      skip: (page - 1) * parseInt(limit), // Calculate skip value
      take: parseInt(limit),
      include: {
        carType: true,
        disponibility: true,
      },
    });
    // Return the result
    await transporters?.map((el: any) => delete el?.password);
    return {
      totalCount,
      transporters,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        // roleId: USERROLES?.transporter?.id
      },
      include: {
        deliverOrders: true,
        carType: true,
      },
    });
    delete user?.password;
    return user;
  }
  async findTransporterOrders(id: number, page: number, limit: number) {
    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Fetch the user and paginate the deliverOrders
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        deliverOrders: {
          where: {
            orderStatusId: 2,
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
          },
          skip, // Number of records to skip
          take: limit, // Number of records to fetch
        },
      },
    });

    // Fetch the total count of deliverOrders for the user
    const totalOrders = await this.prisma.order.count({
      where: {
        deliveredByUserId: id,
        orderStatusId: 2,
      },
    });

    // Remove password from the user object
    delete user?.password;

    // Paginated response
    return {
      user,
      deliverOrders: user?.deliverOrders || [],
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  }

  async findTransporterAcceptedOrders(id: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        deliverOrders: {
          where: {
            orderStatusId: 3,
            startTransitAt: {
              not: null,
            },
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
          },
          skip: skip,
          take: limit,
        },
      },
    });

    // Count the total number of deliver orders for pagination
    const totalDeliverOrders = await this.prisma.order.count({
      where: {
        deliveredByUserId: id,
        orderStatusId: 3,
        startTransitAt: {
          not: null,
        },
      },
    });

    // Remove password from the user object
    delete user?.password;

    return {
      user,
      deliverOrders: user?.deliverOrders || [],
      pagination: {
        totalItems: totalDeliverOrders,
        totalPages: Math.ceil(totalDeliverOrders / limit),
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  async findTransporterDeliveredOrders(
    id: number,
    page: number,
    limit: number,
  ) {
    // Calculate the skip value based on the current page and limit
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        deliverOrders: {
          where: {
            orderStatusId: 4,
            startTransitAt: {
              not: null,
            },
            deliveredAt: {
              not: null,
            },
          },
          skip, // Skip the records for the current page
          take: limit, // Take the limit number of records
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

    // Handle pagination details
    const totalDeliverOrders = await this.prisma.order.count({
      where: {
        deliveredByUserId: id,
        orderStatusId: 4,
        startTransitAt: {
          not: null,
        },
        deliveredAt: {
          not: null,
        },
      },
    });

    const totalPages = Math.ceil(totalDeliverOrders / limit);

    // Remove password from the user object
    delete user?.password;

    return {
      user: user?.deliverOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalDeliverOrders,
        limit,
      },
    };
  }

  update(id: number, updateTransporterDto: UserDTO) {
    return this.userService.updateUser(id, {
      ...updateTransporterDto,
      roleId: USERROLES?.transporter?.id,
    });
  }

  remove(id: number) {
    return this.userService.removeUser(id);
  }
}
