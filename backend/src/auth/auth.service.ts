//src/auth/auth.service.ts
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/login.dto';
import { USERROLES } from '../utils/enum';
import { CreateTransporterDto } from '../transporters/dto/create-transporter.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAdminTransporters() {
    return this.prisma.user.findMany({
      where: {
        roleId: USERROLES.transporter.id,
        verified: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        vehicleNumber: true,
        vehicleSize: true,
        maxWeightKg: true,
      },
    });
  }

  async generateTokens(payload: any): Promise<any> {
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password !');
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
    });

    delete user?.password;

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async register(userData: any): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData?.email },
    });

    if (existingUser) {
      throw new HttpException(
        `User with email ${userData?.email} already exists !`,
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const accountType = userData.accountType === 'B2C' ? 'B2C' : 'B2B';

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        accountType,
        roleId: [USERROLES?.user?.id, USERROLES?.transporter?.id].includes(
          userData?.roleId,
        )
          ? userData.roleId
          : 3,
        verified: true,
        disponibility: {
          create: userData?.disponibility,
        },
      } as any,
      include: {
        disponibility: true,
      },
    });

    delete newUser.password;

    return {
      message: 'Compte créé.',
      user: newUser,
    };
  }

  async verifyEmail(body: { email: string; code: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const record = await this.prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        code: body.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new UnauthorizedException('Code invalide ou expiré');
    }

    const verifiedUser = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationCode.update({
        where: { id: record.id },
        data: { used: true },
      });

      return tx.user.update({
        where: { id: user.id },
        data: { verified: true },
      });
    });

    const tokens = await this.generateTokens({ userId: user.id });
    const safeUser = { ...verifiedUser, password: undefined };

    delete safeUser.password;

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: safeUser,
    };
  }

  async refreshToken(refreshTok: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshTok, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const payload = { userId: decoded.userId };
      const tokens = await this.generateTokens(payload);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async requestPasswordReset(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found !');
      }

      const resetPasswordToken = await this.jwtService.sign(
        { userId: user?.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_RESET_PASSWORD_EXP_IN || '1d',
        },
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken } as any,
      });

      return {
        success: true,
        resetPasswordToken,
        message: 'Reset password token generated successfully.',
      };
    } catch (error) {
      return false;
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    try {
      const { newPassword, resetPasswordToken } = dto;

      try {
        const decoded = this.jwtService.verify(resetPasswordToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

        const user = await this.prisma.user.findUnique({
          where: { id: decoded?.userId, resetPasswordToken },
        });

        if (!user) {
          throw new NotFoundException('User not found or invalid token !');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword, resetPasswordToken: null } as any,
        });

        return true;
      } catch (verifyError) {
        if ((verifyError as Error).name === 'TokenExpiredError') {
          throw new UnauthorizedException('Reset password token has expired !');
        } else {
          throw verifyError;
        }
      }
    } catch (error) {
      return false;
    }
  }

  async createTransporterByAdmin(dto: CreateTransporterDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!dto.email) {
      throw new HttpException('Email requis', 400);
    }

    if (existingUser) {
      throw new HttpException('Email déjà utilisé', 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const transporter = await this.prisma.user.create({
      data: {
        firstName: dto.firstName || '',
        lastName: dto.lastName || '',
        email: dto.email.toLowerCase().trim(),
        password: hashedPassword,
        roleId: USERROLES.transporter.id,
        verified: true,
        vehicleNumber: dto.vehicleNumber || '',
        vehicleSize: dto.vehicleSize || 'medium',
        maxWeightKg: dto.maxWeightKg || 0,
      },
    });

    delete transporter.password;
    return transporter;
  }

  async getAuthUser(token: any) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded) {
        throw new NotFoundException('Invalid token!');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded?.userId },
        include: {
          disponibility: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found or invalid token !');
      }

      delete user?.password;
      return { accessToken: token, user };
    } catch (error) {
      throw new NotFoundException('Invalid token!');
    }
  }
}