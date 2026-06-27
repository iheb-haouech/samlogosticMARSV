import { Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TransportersController],
  providers: [TransportersService, PrismaService, UserService, JwtService],
})
export class TransportersModule {}
