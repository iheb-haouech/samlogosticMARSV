import { HttpService } from "@nestjs/axios"; // à ajouter en haut si pas encore
import { firstValueFrom } from "rxjs";       // idem
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderTransporterDto,
} from './dto/update-order.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ResponseDto } from '../utils/response.dto';
import { USERROLES } from 'src/utils/enum';
import {
  AllOrderDtoResponse,
  OrderDtoResponse,
} from './dto/order-response.dto';
import { PdfGeneratorService } from "src/pdf-generator/pdf-generator.service";


@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly httpService: HttpService, // 👈 ajoute ça
    private readonly pdfGeneratorService: PdfGeneratorService, // 👈 AJOUTER

  ) {}
  @Post(":id/invoice-trigger")
async triggerInvoice(@Param("id") id: string) {
  const order = await this.ordersService.findOne(id);

  // TODO: adapter quand on connaîtra exactement les champs
  const payload = {
    orderId: order.id,
    trackingId: order.trackingId,
    customerEmail: order.recipient?.email,
    customerName: order.recipient?.companyName,
  };

  // 👉 remplace l’URL par celle que n8n te donnera (Webhook URL)
  const n8nUrl = "https://TON_N8N_URL/webhook/invoice-trigger";

  await firstValueFrom(this.httpService.post(n8nUrl, payload));

  return { success: true };
}
  @Post('/create-order')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id)
  @ApiOkResponse({
    description: 'Update order response',
    type: OrderDtoResponse,
  })
  create(
    @AuthUserJWT() userToken: string | undefined,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(userToken, createOrderDto);
  }

  @Get('/all-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id, USERROLES?.transporter?.id,)
  @ApiOkResponse({
    description: 'Get all orders response',
    type: AllOrderDtoResponse,
  })
  async findAll(
    @AuthUserJWT() userToken: string | undefined,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('trackingId') trackingId: string,
    @Query('status') status: string,
  ) {
    return this.ordersService.findAll(
      userToken,
      +page,
      +limit,
      trackingId,
      status,
    );
  }

  @Get('/order-details/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id,
  USERROLES?.transporter?.id,)
  @ApiOkResponse({
    description: 'Get order details response',
    type: OrderDtoResponse,
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('/order-status-details/:id')
  @ApiOkResponse({
    description: 'Get order details response',
    type: OrderDtoResponse,
  })
  findOrderStatus(@Param('id') id: string) {
    return this.ordersService.findOrder(id);
  }

  @Patch('/update-order/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id)
  @ApiOkResponse({
    description: 'Update order response',
    type: OrderDtoResponse,
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch('/update-order-transporter/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id)
  @ApiOkResponse({
    description: 'Update order response',
    type: OrderDtoResponse,
  })
  updateOrderTransporter(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderTransporterDto,
  ) {
    return this.ordersService.updateOrderTransporter(id, updateOrderDto);
  }
  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.admin?.id)
  async togglePayment(@Param('id') id: string, @Body() dto: { amount: number }) {
    return this.ordersService.togglePaymentRequired(id, dto);
  }

  @Patch(':id/paid')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.admin?.id)
  async markPaid(@Param('id') id: string) {
    return this.ordersService.markPaid(id);
  }
  @Patch('/update-order-status/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id, USERROLES?.transporter?.id)
  @ApiOkResponse({
    description: 'Update order response',
    type: OrderDtoResponse,
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderDto);
  }

  @Delete('/delete-order/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.user?.id, USERROLES?.admin?.id)
  @ApiOkResponse({
    description: 'Update order response',
    type: ResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
