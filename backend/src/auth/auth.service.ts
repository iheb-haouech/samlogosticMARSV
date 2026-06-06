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
import { MailerService } from '@nestjs-modules/mailer';
import { USERROLES } from '../utils/enum';
import { CreateTransporterDto } from '../transporters/dto/create-transporter.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}
async getAdminTransporters() {
  return this.prisma.user.findMany({
    where: { 
      roleId: USERROLES.transporter.id,
      verified: true 
    },
    select: {
      id: true, firstName: true, lastName: true, 
      email: true, vehicleNumber: true,
      vehicleSize: true, maxWeightKg: true
    }
  });
}
  async generateTokens(payload: any): Promise<any> {
  const accessToken = await this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // ✅ FIX
  });

  const refreshToken = await this.jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d', // ✅ FIX
  });
  return { accessToken, refreshToken };
}

  async login(email: string, password: string): Promise<any> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    
    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user?.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password !');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
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
    // Check if a user with the given email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData?.email },
    });

    if (existingUser) {
      throw new HttpException(
        `User with email ${userData?.email} already exists !`,
        400,
      );
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const accountType =
    userData.accountType === 'B2C' ? 'B2C' : 'B2B';
    // Create a new user in the database
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
    verified: true, // ✅ Auto-vérifié pour simplifier (sinon false et ajouter étape vérification email)
    disponibility: {
      create: userData?.disponibility,
    },
  } as any,
  include: {
    disponibility: true,
  },
});




// 4) Ne pas encore générer d’accessToken : il doit d’abord vérifier son email
delete newUser.password;
return {
  message: 'Compte créé.',
  user: newUser,
};

  }
  async verifyEmail(body: { email: string; code: string }) {
    // 1. Trouve user par email
    const user = await this.prisma.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    // 2. Cherche le code
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

    // 3. Transaction
    const verifiedUser = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationCode.update({
        where: { id: record.id },
        data: { used: true }
      });
      return tx.user.update({
        where: { id: user.id },
        data: { verified: true }
      });
    });

    // 4. Tokens
    const tokens = await this.generateTokens({ userId: user.id });
    const safeUser = { ...verifiedUser, password: undefined };
    delete safeUser.password;
    return { 
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken, 
      user: safeUser 
    };
  }

  // ← refreshToken continue normalement ici
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

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      // Check if the user with the provided email exists
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found !');
      }

      // Generate a token for password reset (you may want to use a library for this)
      const resetPasswordToken = await this.jwtService.sign(
        { userId: user?.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_RESET_PASSWORD_EXP_IN || '1d',
        },
      );

      // Save the reset token in the user's record
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken } as any,
      });

      // Send the reset token to the user via email or another channel
      await this.mailerService.sendMail({
        to: user?.email,
        from: process.env.MAIL_FROM, // override default from
        subject: 'Trouble Logging In? Reset Your Password',
        template: './requestResetPassword',
        context: {
          name: user?.firstName,
          link: `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    try {
      const { newPassword, resetPasswordToken } = dto;

      try {
        // Verify the reset password token and get the decoded payload
        const decoded = this.jwtService.verify(resetPasswordToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

        // Fetch user details based on the decoded user ID from the reset token
        const user = await this.prisma.user.findUnique({
          where: { id: decoded?.userId, resetPasswordToken },
        });

        if (!user) {
          throw new NotFoundException('User not found or invalid token !');
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and reset token
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword, resetPasswordToken: null } as any,
        });

        return true;
      } catch (verifyError) {
        // Handle token verification errors
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
  // Vérifie email existant
  const existingUser = await this.prisma.user.findUnique({
    where: { email: dto.email }
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
      verified: true,  // ✅ Auto-vérifié
      vehicleNumber: dto.vehicleNumber || '',
      vehicleSize: dto.vehicleSize || 'medium',
      maxWeightKg: dto.maxWeightKg || 0,
    }
  });

  delete transporter.password;
  return transporter;
}
  async getAuthUser(token: any) {
    try {
      // Verify the reset password token and get the decoded payload
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded) {
        throw new NotFoundException('Invalid token!');
      }

      // Fetch user details based on the decoded user ID from the reset token
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
  // Quand admin crée transporteur

}

