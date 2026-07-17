import { Module } from '@nestjs/common';
import { QuotationsController } from './quotations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuotationsController],
  providers: [PrismaService],
})
export class QuotationsModule {}