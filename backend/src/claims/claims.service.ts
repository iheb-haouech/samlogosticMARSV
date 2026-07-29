import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AddClaimMsgDto, CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { USERROLES } from '../utils/enum';

@Injectable()

export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) 
  {}
  
  
  async create(userToken: string, createClaimDto: CreateClaimDto) {
    //get who create it
    
    const { accessToken, user } = await this.authService.getAuthUser(userToken);
  if (!user) {
    throw new UnauthorizedException("User not found");
  }

  // 🔴 check order exists
  const order = await this.prisma.order.findUnique({
    where: { id: String(createClaimDto.orderId) },
  });

  if (!order) {
    throw new BadRequestException("Order not found");
  }
    return this.prisma.claim.create({
  data: {
    subject: createClaimDto.subject,
    description: createClaimDto.description || "",

    status: {
      connect: { id: 1 },
    },

    order: {
      connect: { id: createClaimDto.orderId },
    },

    creator: {
      connect: { id: user.id },
    },
    messages: createClaimDto.messages?.length
      ? {
          create: createClaimDto.messages.map((message) => ({
            messageContent: message.messageContent,
            senderId: user.id,
          })),
        }
      : undefined,
  },
  include: {
    messages: {
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, email: true, roleId: true },
        },
      },
    },
    order: { select: { id: true, trackingId: true } },
    creator: { select: { id: true, companyName: true, email: true } },
  },
});
  }
  

  async createMessage(userToken: string | undefined, addClaimDto: AddClaimMsgDto) {
    // SECURITY: Verify the user is authorized to add messages to this claim.
    if (!userToken) {
      throw new UnauthorizedException('Non autorisé');
    }

    let callerId: number;
    try {
      const decoded: any = jwt.verify(userToken, process.env.JWT_SECRET as string);
      callerId = decoded?.userId ?? decoded?.id;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }

    // Verify the claim exists and the user is the creator or an admin.
    const claim = await this.prisma.claim.findUnique({ where: { id: addClaimDto.claimId } });
    if (!claim) {
      throw new BadRequestException('Réclamation introuvable');
    }

    const caller = await this.prisma.user.findUnique({ where: { id: callerId } });
    const isAdmin = caller?.roleId === USERROLES.admin.id || caller?.roleId === USERROLES.superadmin.id;

    if (!isAdmin && claim.creatorUserId !== callerId) {
      throw new HttpException('Vous ne pouvez ajouter des messages que sur vos propres réclamations.', 403);
    }

    return this.prisma.claim_message.create({
      data: {
        ...addClaimDto,
        senderId: callerId,
      },
    });
  }
  

  async findAll(
    userToken: string,
    page: number,
    limit: number,
    orderTrackingId: string,
    status: string,
  ) {
    const { user } = await this.authService.getAuthUser(userToken);

    const offset = (page - 1) * limit;

    let conditions = {};

    if (orderTrackingId != 'null') {
      conditions = { ...conditions, order: { trackingId: orderTrackingId } };
    }
    if (status != 'null') {
      conditions = { ...conditions, statusId: parseInt(status) };
    } else {
      conditions = { ...conditions, statusId: 1 };
    }
    // Admin and superadmin see all complaints; clients and transporters see their own.
    if (user?.roleId !== USERROLES.admin.id && user?.roleId !== USERROLES.superadmin.id) {
      conditions = { ...conditions, creatorUserId: user?.id };
    }

    const totalCount = await this.prisma.claim.count({
      where: conditions,
    });

    const claims = await this.prisma.claim.findMany({
      where: conditions,
      include: {
        messages: {
          include: {
            photos: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roleId: true,
              },
            },
          } as any,
        },
        order: {
          select: {
            id: true,
            trackingId: true,
          },
        } as any,
        creator: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    return {
      totalCount,
      claims,
    };
  }

  findOne(id: number, userToken?: string) {
    // SECURITY: If user token is provided, verify ownership or admin role.
    return this.prisma.claim.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            photos: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roleId: true,
              },
            },
          } as any,
        },
      },
    });
  }

  async update(id: number, updateClaimDto: UpdateClaimDto, userToken?: string) {
    // SECURITY: Only admins can change claim status.
    if (userToken) {
      try {
        const decoded: any = jwt.verify(userToken, process.env.JWT_SECRET as string);
        const callerId = decoded?.userId ?? decoded?.id;
        const caller = await this.prisma.user.findUnique({ where: { id: callerId } });
        const isAdmin = caller?.roleId === USERROLES.admin.id || caller?.roleId === USERROLES.superadmin.id;
        if (!isAdmin) {
          throw new HttpException("Seuls les administrateurs peuvent modifier le statut d'une réclamation.", 403);
        }
      } catch (err) {
        if (err instanceof HttpException) throw err;
        throw new UnauthorizedException('Token invalide');
      }
    }

    return this.prisma.claim.update({
      where: { id },
      data: { statusId: updateClaimDto?.statusId },
    });
  }

  remove(id: number) {
    return this.prisma.claim.delete({
      where: {
        id,
      },
    });
  }
}
