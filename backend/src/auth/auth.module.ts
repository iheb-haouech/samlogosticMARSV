import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    UserModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Reflector, RoleGuard],
  exports: [JwtModule, AuthService, RoleGuard],
})
export class AuthModule {}