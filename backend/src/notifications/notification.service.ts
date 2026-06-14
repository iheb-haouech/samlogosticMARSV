import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async findAll(userToken: string) {
    const { user } = await this.authService.getAuthUser(userToken);
    if (!user?.id) {
      return [];
    }
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(userToken: string, dto: CreateNotificationDto) {
    const { user } = await this.authService.getAuthUser(userToken);
    if (!user?.id) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    let userIds: number[] = [];

    if (dto.userId) {
      userIds = [dto.userId];
    } else if (dto.roleId) {
      const roleUsers = await this.prisma.user.findMany({
        where: { roleId: dto.roleId },
        select: { id: true },
      });
      userIds = roleUsers.map((u) => u.id);
    } else if (dto.allUsers) {
      const allUsers = await this.prisma.user.findMany({
        where: { roleId: { not: null } },
        select: { id: true },
      });
      userIds = allUsers.map((u) => u.id);
    }

    const notifications = [];
    for (const uid of userIds) {
      notifications.push(
        this.prisma.notification.create({
          data: {
            userId: uid,
            title: dto.title,
            message: dto.message,
            type: dto.type || 'info',
            orderId: dto.orderId,
          },
        }),
      );
    }

    return this.prisma.$transaction(notifications);
  }

  async markAsRead(userToken: string, notificationId: number) {
    const { user } = await this.authService.getAuthUser(userToken);
    if (!user?.id) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId: user.id },
    });

    if (!notification) {
      throw new NotFoundException('Notification introuvable');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async getUnreadCount(userToken: string) {
    const { user } = await this.authService.getAuthUser(userToken);
    if (!user?.id) {
      return { count: 0 };
    }

    const count = await this.prisma.notification.count({
      where: { userId: user.id, read: false },
    });

    return { count };
  }

  async notifyOrderCreated(order: any) {
    const orderData: any = order;
    const creatorId = orderData.createdByUserId;
    if (!creatorId) return;

    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
      select: { roleId: true },
    });

    if (!creator) return;

    const title = 'Commande créée';
    const message = `Commande ${orderData.trackingId || orderData.id} créée avec succès.`;

    if (creator.roleId === 3) {
      await this.createDirectNotification(creatorId, title, message, 'order', orderData.id);
    }
  }

  async notifyOrderStatusUpdate(order: any, newStatusId: number) {
    const orderData: any = order;
    const statusName = ['Created', 'Pending', 'In transit', 'Delivered', 'Canceled', 'Returned'][newStatusId - 1] || 'Updated';

    const creatorId = orderData.createdByUserId;
    const transporterId = orderData.deliveredByUserId;

    if (creatorId) {
      const title = `Commande ${statusName}`;
      const message = `Commande ${orderData.trackingId || orderData.id} est maintenant: ${statusName}`;
      await this.createDirectNotification(creatorId, title, message, 'order', orderData.id);
    }

    if (transporterId && transporterId !== creatorId) {
      const title = `Commande ${statusName}`;
      const message = `Commande ${orderData.trackingId || orderData.id} est maintenant: ${statusName}`;
      await this.createDirectNotification(transporterId, title, message, 'order', orderData.id);
    }
  }

  private async createDirectNotification(userId: number, title: string, message: string, type: string, orderId?: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type as any,
        orderId,
      },
    });
  }
}
