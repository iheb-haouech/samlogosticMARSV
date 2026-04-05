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
import { USERROLES } from 'src/utils/enum';
import { CreateTransporterDto } from 'src/transporters/dto/create-transporter.dto';

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
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXP_IN,
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
    if (!user.verified && user.roleId === 3) {
      throw new UnauthorizedException('Votre email n’est pas encore vérifié.');
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

    // Create a new user in the database
const newUser = await this.prisma.user.create({
  data: {
    ...userData,
    password: hashedPassword,
    roleId: [USERROLES?.user?.id, USERROLES?.transporter?.id].includes(
      userData?.roleId,
    )
      ? userData.roleId
      : 3,
    verified: false,
    disponibility: {
      create: userData?.disponibility,
    },
  } as any,
  include: {
    disponibility: true,
  },
});

// 1) Générer un code à 6 chiffres
const code = Math.floor(100000 + Math.random() * 900000).toString();

// 2) Sauvegarder en BDD
await this.prisma.emailVerificationCode.create({
  data: {
    userId: newUser.id,
    code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  },
});

// 3) Envoyer l’email
await this.mailerService.sendMail({
  to: newUser.email,
  from: process.env.MAIL_FROM,
  subject: 'Vérification de votre adresse email',
  template: './emailVerification', // à créer dans tes templates
  context: {
    name: newUser.firstName || newUser.companyName || '',
    code,
  },
  
});

// 4) Ne pas encore générer d’accessToken : il doit d’abord vérifier son email
delete newUser.password;
return {
  message: 'Compte créé. Un code de vérification a été envoyé à votre email.',
  user: newUser,
};

  }
  async verifyEmail(body: { email: string; code: string }) {
    console.log('Reçu:', body.email, body.code);

    // 1. Trouve user par email
    const user = await this.prisma.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    console.log('User trouvé ID:', user.id);

    // 2. Cherche le code
    const record = await this.prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        code: body.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
    console.log('Cherche:', { userId: user.id, code: body.code, used: false });
    const allCodes = await this.prisma.emailVerificationCode.findMany({ where: { userId: user.id } });
    console.log('Tous codes user:', allCodes);
    if (!record) {
      console.log('Pas de record trouvé');
      throw new UnauthorizedException('Code invalide ou expiré');
    }

    // 3. Transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationCode.update({
        where: { id: record.id },
        data: { used: true }
      });
      await tx.user.update({
        where: { id: user.id },
        data: { verified: true }
      });
    });

    // 4. Tokens
    const tokens = await this.generateTokens({ userId: user.id });
    const safeUser = { ...user, password: undefined };
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
          expiresIn: process.env.JWT_REFRESH_EXP_IN,
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
        if (verifyError.name === 'TokenExpiredError') {
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
    console.log('DTO reçu:', dto);  // 🔍 Debug
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



