import { Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TransportersController],
  providers: [TransportersService, PrismaService, UserService, JwtService],
})
export class TransportersModule {}
