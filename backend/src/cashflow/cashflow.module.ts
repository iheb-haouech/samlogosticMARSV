import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CashflowController } from './cashflow.controller';
import { CashflowService } from './cashflow.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CashflowController],
  providers: [CashflowService],
})
export class CashflowModule {}
