// backend/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PackagesService } from '../packages/packages.service';
import { PdfGeneratorModule } from 'src/pdf-generator/pdf-generator.module'; // 👈 AJOUTER

@Module({
  imports: [HttpModule,PdfGeneratorModule,],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    AuthService,
    PackagesService,
    JwtService,
  
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
