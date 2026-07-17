import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async checkHealth() {
    const startedAt = Date.now();
    try {
      // Lightweight round-trip to verify the database is reachable.
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'up',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'down',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
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
    if (user?.roleId == USERROLES.admin.id || user?.roleId == USERROLES.superadmin.id) {
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
      verified: true,
    },
  });

  const totalWaitingProviders = await this.prisma.user.count({
    where: {
      roleId: USERROLES.user.id,
      verified: true,
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
      roleId: USERROLES.transporter.id,
      verified: false,
    },
  });

     const [
    b2bWaitingOrders,
    b2bTransitOrders,
    b2bLivredOrders,
    b2bCanceledOrders,
  ] = await Promise.all([
    this.prisma.order.count({
      where: {
        orderStatusId: 1,
        createdBy: { accountType: 'B2B' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 3,
        createdBy: { accountType: 'B2B' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 4,
        createdBy: { accountType: 'B2B' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 5,
        createdBy: { accountType: 'B2B' },
      },
    }),
  ]);

  // ✅ NOUVEAU : stats B2C
  const [
    b2cWaitingOrders,
    b2cTransitOrders,
    b2cLivredOrders,
    b2cCanceledOrders,
  ] = await Promise.all([
    this.prisma.order.count({
      where: {
        orderStatusId: 1,
        createdBy: { accountType: 'B2C' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 3,
        createdBy: { accountType: 'B2C' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 4,
        createdBy: { accountType: 'B2C' },
      },
    }),
    this.prisma.order.count({
      where: {
        orderStatusId: 5,
        createdBy: { accountType: 'B2C' },
      },
    }),
  ]);

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

    // 👇 NOUVEAU : on renvoie deux blocs
    b2b: {
      waiting: b2bWaitingOrders,
      inTransit: b2bTransitOrders,
      delivered: b2bLivredOrders,
      canceled: b2bCanceledOrders,
    },
    b2c: {
      waiting: b2cWaitingOrders,
      inTransit: b2cTransitOrders,
      delivered: b2cLivredOrders,
      canceled: b2cCanceledOrders,
    },
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

  /**
   * B2B client logistics KPIs, scoped to the authenticated client.
   * Used by the client dashboard to drive the KPI view.
   */
  async getClientKpis(userToken: string) {
    const { user } = await this.authService.getAuthUser(userToken);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const userId = user.id;

    const now = new Date();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    // All orders created by this client with the fields we need.
    const clientOrders = await this.prisma.order.findMany({
      where: { createdByUserId: userId },
      select: {
        id: true,
        orderStatusId: true,
        startTransitAt: true,
        deliveredAt: true,
        transporterPrice: true,
        createdAt: true,
        packages: { select: { id: true } },
      },
    });

    const totalOrders = clientOrders.length;
    const deliveredOrders = clientOrders.filter((o) => o.orderStatusId === 4);
    const returnedOrders = clientOrders.filter((o) => o.orderStatusId === 6);
    const inTransitOrders = clientOrders.filter((o) => o.orderStatusId === 3);
    const waitingOrders = clientOrders.filter(
      (o) => o.orderStatusId === 1 || o.orderStatusId === 2,
    );
    const canceledOrders = clientOrders.filter((o) => o.orderStatusId === 5);

    // On-time rate: delivered AND (deliveredAt <= startTransitAt + 2 days).
    const onTimeDeliveries = deliveredOrders.filter((o) => {
      if (!o.startTransitAt || !o.deliveredAt) return false;
      const target = new Date(o.startTransitAt).getTime() + twoDaysInMs;
      return new Date(o.deliveredAt).getTime() <= target;
    });
    const onTimeRate =
      deliveredOrders.length > 0
        ? (onTimeDeliveries.length / deliveredOrders.length) * 100
        : 0;

    // Claims (incidents) for this client.
    const clientClaims = await this.prisma.claim.findMany({
      where: { creatorUserId: userId },
      select: {
        id: true,
        statusId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const totalClaims = clientClaims.length;
    const resolvedClaims = clientClaims.filter((c) => c.statusId === 3 || c.statusId === 4);
    const damageRate =
      deliveredOrders.length > 0 ? (totalClaims / deliveredOrders.length) * 100 : 0;

    // Average incident resolution time (days) over resolved claims.
    let avgResolutionDays = 0;
    if (resolvedClaims.length > 0) {
      const totalMs = resolvedClaims.reduce((sum, c) => {
        const created = new Date(c.createdAt).getTime();
        const resolved = new Date(c.updatedAt).getTime();
        return sum + Math.max(0, resolved - created);
      }, 0);
      avgResolutionDays =
        totalMs / resolvedClaims.length / (24 * 60 * 60 * 1000);
    }

    // Average cost per parcel.
    const totalTransporterPrice = clientOrders.reduce(
      (sum, o) => sum + (o.transporterPrice || 0),
      0,
    );
    const totalPackages = clientOrders.reduce(
      (sum, o) => sum + (o.packages?.length || 0),
      0,
    );
    const costPerParcel = totalPackages > 0 ? totalTransporterPrice / totalPackages : 0;

    const returnRate =
      totalOrders > 0 ? (returnedOrders.length / totalOrders) * 100 : 0;

    // Monthly volume trend over the last 6 months.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentOrders = await this.prisma.order.findMany({
      where: {
        createdByUserId: userId,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    });

    const monthLabels: string[] = [];
    const monthlyVolumeMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthLabels.push(key);
      monthlyVolumeMap.set(key, 0);
    }
    recentOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyVolumeMap.has(key)) {
        monthlyVolumeMap.set(key, (monthlyVolumeMap.get(key) || 0) + 1);
      }
    });
    const monthlyVolume = monthLabels.map((label) => ({
      month: label,
      volume: monthlyVolumeMap.get(label) || 0,
    }));

    return {
      summary: {
        totalOrders,
        delivered: deliveredOrders.length,
        inTransit: inTransitOrders.length,
        waiting: waitingOrders.length,
        returned: returnedOrders.length,
        canceled: canceledOrders.length,
      },
      kpis: {
        onTimeRate: Number(onTimeRate.toFixed(1)),
        damageRate: Number(damageRate.toFixed(1)),
        avgResolutionDays: Number(avgResolutionDays.toFixed(1)),
        costPerParcel: Number(costPerParcel.toFixed(2)),
        returnRate: Number(returnRate.toFixed(1)),
        totalClaims,
        openClaims: totalClaims - resolvedClaims.length,
      },
      monthlyVolume,
    };
  }
}
