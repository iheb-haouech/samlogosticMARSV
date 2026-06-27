import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { USERROLES } from '../utils/enum';
import { CashflowService } from './cashflow.service';
import { BlockUserDto, CashoutDto, PayClientDto, ReceiveTransporterDto, SettlementDto } from './dto/cashflow.dto';

@Controller('cashflow')
@ApiTags('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Get('summary')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  getSummary() {
    return this.cashflowService.getSummary();
  }

  @Get('users')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  listUsers(@Query('type') type: 'clients' | 'transporters' = 'clients') {
    return this.cashflowService.listUsers(type);
  }

  @Post('users/:id/cashout')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  cashout(@Param('id') id: string, @Body() dto: CashoutDto) {
    return this.cashflowService.cashout(+id, dto);
  }

  @Patch('users/:id/block')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  setBlocked(@Param('id') id: string, @Body() dto: BlockUserDto) {
    return this.cashflowService.setBlocked(+id, dto.blocked);
  }

  @Post('settlement')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  recordSettlement(@Body() dto: SettlementDto) {
    return this.cashflowService.recordSettlement(dto);
  }

  @Post('settlement/receive-transporter')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  receiveTransporter(@Body() dto: ReceiveTransporterDto) {
    return this.cashflowService.receiveFromTransporter(dto);
  }

  @Post('settlement/pay-client')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id)
  payClient(@Body() dto: PayClientDto) {
    return this.cashflowService.payClient(dto);
  }
}
