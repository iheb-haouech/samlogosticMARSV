import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EventBusService } from '../microservices/event-bus.service';
import { OnModuleInit } from '@nestjs/common';
import { QueueService } from '../microservices/queue.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private eventBus: EventBusService,
    private queue: QueueService,
  ) {}

  onModuleInit() {
    // Subscribe to events and auto-create notifications
    this.eventBus.subscribe('order.created', async (data: any) => {
      await this.notifyOrderCreated(data);
    });

    this.eventBus.subscribe('order.statusChanged', async (data: any) => {
      await this.notifyOrderStatusUpdate(data, data.newStatusId);
    });

    this.eventBus.subscribe('order.transporterAssigned', async (data: any) => {
      await this.createDirectNotification(
        data.deliveredByUserId,
        'Commande assignée',
        `Commande ${data.trackingId} vous a été assignée.`,
        'order',
        data.orderId,
      );
    });

    this.eventBus.subscribe('claim.created', async (data: any) => {
      await this.createDirectNotification(
        data.createdByUserId,
        'Réclamation créée',
        `Réclamation pour la commande ${data.orderId}: ${data.subject}`,
        'claim',
        data.orderId,
      );
    });

    this.eventBus.subscribe('claim.statusChanged', async (data: any) => {
      // Notify all admins about claim status changes
      const admins = await this.prisma.user.findMany({
        where: { roleId: { in: [1, 4] } },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.createDirectNotification(
          admin.id,
          'Statut réclamation mis à jour',
          `Réclamation #${data.claimId} - Nouveau statut: ${data.newStatusId}`,
          'claim',
        );
      }
    });

    // Register PDF generation queue worker
    this.queue.process('pdf.generation', async (job: any) => {
      this.logger.log(`Processing PDF generation for order ${job.data.trackingId}`);
      // PDF generation is handled by the existing PdfGeneratorService
      // This worker acts as a future hook for async PDF processing
    });

    // Register notification queue worker
    this.queue.process('notification.send', async (job: any) => {
      this.logger.log(`Processing notification for user ${job.data.userId}`);
      const { userId, title, message, type, orderId } = job.data;
      await this.createDirectNotification(userId, title, message, type, orderId);
    });

    this.logger.log('Event subscriptions and queue workers initialized');
  }

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
