import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { USERROLES } from '../utils/enum';
import { CashflowService } from './cashflow.service';
import { BlockUserDto, CashoutDto, PayClientDto, ReceiveTransporterDto, SettlementDto } from './dto/cashflow.dto';

@Controller('cashflow')
@ApiTags('cashflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(USERROLES.admin.id)
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Get('summary')
  getSummary() {
    return this.cashflowService.getSummary();
  }

  @Get('users')
  listUsers(@Query('type') type: 'clients' | 'transporters' = 'clients') {
    return this.cashflowService.listUsers(type);
  }

  @Post('users/:id/cashout')
  cashout(@Param('id') id: string, @Body() dto: CashoutDto) {
    return this.cashflowService.cashout(+id, dto);
  }

  @Patch('users/:id/block')
  setBlocked(@Param('id') id: string, @Body() dto: BlockUserDto) {
    return this.cashflowService.setBlocked(+id, dto.blocked);
  }

  @Post('settlement')
  recordSettlement(@Body() dto: SettlementDto) {
    return this.cashflowService.recordSettlement(dto);
  }

  @Post('settlement/receive-transporter')
  receiveTransporter(@Body() dto: ReceiveTransporterDto) {
    return this.cashflowService.receiveFromTransporter(dto);
  }

  @Post('settlement/pay-client')
  payClient(@Body() dto: PayClientDto) {
    return this.cashflowService.payClient(dto);
  }
}
