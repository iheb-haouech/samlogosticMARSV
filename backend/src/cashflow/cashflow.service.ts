import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CashoutDto, PayClientDto, ReceiveTransporterDto, SettlementDto } from './dto/cashflow.dto';

const ROLE_TRANSPORTER = 2;
const ROLE_CLIENT = 3;

@Injectable()
export class CashflowService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [clients, transporters, b2bDeliveredFees, b2cDeliveredOrders] =
      await Promise.all([
        this.prisma.user.aggregate({
          where: { roleId: ROLE_CLIENT },
          _sum: { walletBalance: true },
        }),
        this.prisma.user.aggregate({
          where: { roleId: ROLE_TRANSPORTER },
          _sum: { walletBalance: true },
        }),
        this.prisma.order.aggregate({
          where: {
            orderStatusId: 4,
            createdBy: { accountType: 'B2B' },
          },
          _sum: { shipmentPrice: true },
        }),
        this.prisma.order.findMany({
          where: {
            orderStatusId: 4,
            createdBy: { accountType: 'B2C' },
          },
          select: { totalPrice: true, shipmentPrice: true },
        }),
      ]);

    const b2cDeliveredRevenue = b2cDeliveredOrders.reduce(
      (sum, order) =>
        sum + (order.totalPrice || 0) + (order.shipmentPrice || 0),
      0,
    );

    const clientsWallet = clients._sum.walletBalance || 0;
    const transportersWallet = transporters._sum.walletBalance || 0;
    const b2bPanier = b2bDeliveredFees._sum.shipmentPrice || 0;

    return {
      clientsWallet,
      transportersWallet,
      b2bDeliveredFees: b2bPanier,
      b2cDeliveredRevenue,
      netServiceEstimate: b2cDeliveredRevenue + b2bPanier - clientsWallet,
    };
  }

  async listUsers(type: 'clients' | 'transporters') {
    const roleId = type === 'transporters' ? ROLE_TRANSPORTER : ROLE_CLIENT;
    return this.prisma.user.findMany({
      where: { roleId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        companyName: true,
        email: true,
        phone: true,
        phoneCountryCode: true,
        verified: true,
        blocked: true,
        walletBalance: true,
        accountType: true,
      },
      orderBy: { walletBalance: 'desc' },
    });
  }

  async cashout(userId: number, dto: CashoutDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Utilisateur introuvable');
      }

      if (dto.amount > user.walletBalance) {
        throw new BadRequestException('Le cashout ne peut pas depasser le panier disponible.');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: dto.amount } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          email: true,
          phone: true,
          phoneCountryCode: true,
          verified: true,
          blocked: true,
          walletBalance: true,
          accountType: true,
        },
      });

      await tx.cashflow_transaction.create({
        data: {
          userId,
          amount: dto.amount,
          type: 'CASHOUT',
          note: dto.note,
        },
      });

      return updatedUser;
    });
  }

  async recordSettlement(dto: SettlementDto) {
    const [transporter, client] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.transporterId } }),
      this.prisma.user.findUnique({ where: { id: dto.clientId } }),
    ]);

    if (!transporter || transporter.roleId !== ROLE_TRANSPORTER) {
      throw new NotFoundException('Transporteur introuvable');
    }
    if (!client || client.roleId !== ROLE_CLIENT) {
      throw new NotFoundException('Client introuvable');
    }
    if (dto.amountReceived > transporter.walletBalance) {
      throw new BadRequestException(
        'Le montant recu depasse le panier transporteur.',
      );
    }
    if (dto.amountToGiveClient > client.walletBalance) {
      throw new BadRequestException(
        'Le montant client depasse le panier disponible.',
      );
    }

    const netGain =
      dto.amountReceived - dto.amountToPayTransporter - dto.amountToGiveClient;

    await this.prisma.$transaction(async (tx) => {
      if (dto.amountReceived > 0) {
        await tx.user.update({
          where: { id: dto.transporterId },
          data: { walletBalance: { decrement: dto.amountReceived } },
        });
        await tx.cashflow_transaction.create({
          data: {
            userId: dto.transporterId,
            amount: dto.amountReceived,
            type: 'SETTLEMENT_RECEIVED',
            note: `Recu admin: ${dto.amountReceived} DT`,
          },
        });
      }

      if (dto.amountToGiveClient > 0) {
        await tx.user.update({
          where: { id: dto.clientId },
          data: { walletBalance: { decrement: dto.amountToGiveClient } },
        });
        await tx.cashflow_transaction.create({
          data: {
            userId: dto.clientId,
            amount: dto.amountToGiveClient,
            type: 'SETTLEMENT_PAID_CLIENT',
            note: `Verse client: ${dto.amountToGiveClient} DT`,
          },
        });
      }
    });

    return {
      netGain,
      amountReceived: dto.amountReceived,
      amountToPayTransporter: dto.amountToPayTransporter,
      amountToGiveClient: dto.amountToGiveClient,
    };
  }

  async receiveFromTransporter(dto: ReceiveTransporterDto) {
    return this.prisma.$transaction(async (tx) => {
      const transporter = await tx.user.findUnique({ where: { id: dto.transporterId } });
      if (!transporter || transporter.roleId !== ROLE_TRANSPORTER) {
        throw new NotFoundException('Transporteur introuvable');
      }
      if (dto.amountReceived > transporter.walletBalance) {
        throw new BadRequestException('Le montant recu depasse le panier transporteur.');
      }

      const updated = await tx.user.update({
        where: { id: dto.transporterId },
        data: { walletBalance: { decrement: dto.amountReceived } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          email: true,
          phone: true,
          phoneCountryCode: true,
          verified: true,
          blocked: true,
          walletBalance: true,
          accountType: true,
        },
      });

      await tx.cashflow_transaction.create({
        data: {
          userId: dto.transporterId,
          amount: dto.amountReceived,
          type: 'SETTLEMENT_RECEIVED',
          note: `Recu admin: ${dto.amountReceived} DT`,
        },
      });

      return updated;
    });
  }

  async payClient(dto: PayClientDto) {
    return this.prisma.$transaction(async (tx) => {
      const client = await tx.user.findUnique({ where: { id: dto.clientId } });
      if (!client || client.roleId !== ROLE_CLIENT) {
        throw new NotFoundException('Client introuvable');
      }
      if (dto.amountToGiveClient > client.walletBalance) {
        throw new BadRequestException('Le montant client depasse le panier disponible.');
      }

      const updated = await tx.user.update({
        where: { id: dto.clientId },
        data: { walletBalance: { decrement: dto.amountToGiveClient } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          email: true,
          phone: true,
          phoneCountryCode: true,
          verified: true,
          blocked: true,
          walletBalance: true,
          accountType: true,
        },
      });

      await tx.cashflow_transaction.create({
        data: {
          userId: dto.clientId,
          amount: dto.amountToGiveClient,
          type: 'SETTLEMENT_PAID_CLIENT',
          note: `Verse client: ${dto.amountToGiveClient} DT`,
        },
      });

      return updated;
    });
  }

  async setBlocked(userId: number, blocked: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { blocked },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        companyName: true,
        email: true,
        phone: true,
        phoneCountryCode: true,
        verified: true,
        blocked: true,
        walletBalance: true,
        accountType: true,
      },
    });
  }
}
