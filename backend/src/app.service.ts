import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { USERROLES } from './utils/enum';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllCompanyTypes() {
    const companyTypes = await this.prisma.company_type.findMany();
    return { company_types: companyTypes };
  }

  async getAllCompanyActivities() {
    const companyActs = await this.prisma.company_activity.findMany();
    return { company_activities: companyActs };
  }

  async getAllCarTypes() {
    const carTypes = await this.prisma.car_type.findMany();
    return { carTypes };
  }

  async getAllOrderStatuses() {
    const statuses = await this.prisma.order_status.findMany();
    return { order_statuses: statuses };
  }

  async getStatistics(userToken: string) {
    // identify user or admin
    const { user } = await this.authService.getAuthUser(userToken);
    if (user?.roleId == 1) {
      const totalWaitingOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 1, // is created and not assigned
        },
      });

      const totalComplaints = await this.prisma.claim.count({
        where: {
          statusId: {
            in: [1, 2],
          },
        },
      });

      const totalClosedComplaints = await this.prisma.claim.count({
        where: {
          statusId: {
            equals: 3,
          },
        },
      });

      const totalTransitOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 3,
        },
      });
      const totalLivredOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 4,
        },
      });
      const totalCanceledOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 5,
        },
      });
      const totalAcceptedProviders = await this.prisma.user.count({
        where: {
          roleId: USERROLES.user.id, 
          verified: true 
        },
      });
      const totalWaitingProviders = await this.prisma.user.count({
        where: {
           roleId: USERROLES.user.id,
          verified: true
        },
      });

      const totalAcceptedTransporters = await this.prisma.user.count({
        where: {
          roleId: USERROLES.transporter.id,
          verified: true,
        },
      });
      const totalWaitingTransporters = await this.prisma.user.count({
        where: {
          roleId: 2,
          verified: false,
        },
      });
      return {
        totalWaitingOrders,
        totalTransitOrders,
        totalLivredOrders,
        totalCanceledOrders,
        totalAcceptedProviders,
        totalWaitingProviders,
        totalAcceptedTransporters,
        totalWaitingTransporters,
        totalComplaints,
        totalClosedComplaints,
      };
    } else if (user?.roleId == 3) {
      const totalWaitingOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 2,
          createdByUserId: user?.id,
        },
      });

      const totalTransitOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 3,
          createdByUserId: user?.id,
        },
      });

      const totalComplaints = await this.prisma.claim.count({
        where: {
          statusId: {
            in: [1, 2],
          },
          creatorUserId: {
            equals: user?.id,
          },
        },
      });

      const totalClosedComplaints = await this.prisma.claim.count({
        where: {
          statusId: {
            equals: 3,
          },
        },
      });

      const totalLivredOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 4,
          createdByUserId: user?.id,
        },
      });
      const totalCanceledOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 5,
          createdByUserId: user?.id,
        },
      });
      return {
        totalWaitingOrders,
        totalTransitOrders,
        totalLivredOrders,
        totalCanceledOrders,
        totalComplaints,
        totalClosedComplaints,
      };
    } else if (user?.roleId == 2) {
      const totalWaitingOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 2,
          deliveredByUserId: user?.id,
        },
      });

      const totalTransitOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 3,
          deliveredByUserId: user?.id,
        },
      });
      const totalLivredOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 4,
          deliveredByUserId: user?.id,
        },
      });
      const totalCanceledOrders = await this.prisma.order.count({
        where: {
          orderStatusId: 5,
          deliveredByUserId: user?.id,
        },
      });
      return {
        totalWaitingOrders,
        totalTransitOrders,
        totalLivredOrders,
        totalCanceledOrders,
      };
    }
  }
}
