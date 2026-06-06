import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CashflowController } from './cashflow.controller';
import { CashflowService } from './cashflow.service';
import { AuthModule } from '../auth/auth.module'; // 👈 module qui expose JwtService
import { RoleGuard } from '../auth/role.guard'; // ← adapte le chemin exact

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [CashflowController],
  providers: [CashflowService, RoleGuard],
})
export class CashflowModule {}
