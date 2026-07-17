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
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from '../utils/response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AllProvidersDTO,
  FindManyProvidersDto,
  GetProviderInvoiceDto,
} from './dto/all-providers.dto';
import { RoleGuard } from '../auth/role.guard';
import { USERROLES } from '../utils/enum';
import { Roles } from '../auth/roles.decorator';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { PaginationDTO } from './dto/pagination.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  create(@Body() createUserDto: UserDTO) {
    return this.userService.create(createUserDto);
  }
  @Get('/invoices')
    @ApiBearerAuth()
    @UseGuards(RoleGuard)
    @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
    getAllInvoices(@Query() query: any) {
      return this.userService.getAllInvoices(query);
    }
  @Get()
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('/superadmin/all-users')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.superadmin.id)
  findAllForSuperAdmin() {
    return this.userService.findAll();
  }

  @Patch('/superadmin/users/:id/role')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.superadmin.id)
  updateRoleAndScope(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateRoleAndScope(+id, body);
  }

  @Get('all-providers')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'verified', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiOkResponse({
    description: 'Get all providers response',
    type: AllProvidersDTO,
  })
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  async findAllProviders(@Query() query: FindManyProvidersDto) {
    return this.userService.findAllProviders(query);
  }

  @Get('/invoice-pdf')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  async downloadInvoice(
    @Query('userId') userId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('type') type: number,
    @Res() res,
  ) {
    const pdf = await this.userService.generateInvoicePdf(
      Number(userId),
      from,
      to,
      type,
    );

    res.setHeader('Content-Type', 'application/pdf');
    return res.send(pdf);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findOne(@Param('id') id: string, @AuthUserJWT() userToken: string | undefined) {
    return this.userService.findOne(+id, userToken);
  }

  @Get('provider-orders/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findProviderOrders(@Param('id') id: string) {
    return this.userService.findProviderOrders(+id);
  }

  @Post('user-orders-invoices/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findUserOrdersInvoices(
    @Param('id') id: string,
    @Body() query: PaginationDTO,
  ) {
    return this.userService.findUserOrdersInvoices(
      +id,
      query?.page,
      query?.limit,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() userDto: UserDTO,
    @AuthUserJWT() userToken: string | undefined,
  ) {
    return this.userService.updateUser(+id, userDto, userToken);
  }

  @Patch('verfieUser/:id')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  verifieUser(@Param('id') id: string) {
    return this.userService.verifie(+id);
  }

  @Patch('/user-disponibility/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  updateUserDisponibility(@Param('id') id: string, @Body() userDto: UserDTO) {
    return this.userService.updateUserDisponibility(+id, userDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  remove(@Param('id') id: string, @AuthUserJWT() userToken: string | undefined) {
    return this.userService.removeUser(+id, userToken);
  }

  @Post('/generate-provider-invoice')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({
    description: 'generate provider invoice in specific period',
    type: ResponseDto,
  })
  getProvidersInvoice(@Body() query: GetProviderInvoiceDto, @Res() res: any) {
    return this.userService.getProvidersInvoice(
      +query?.id,
      query?.from,
      query?.to,
      +query?.invoiceType,
      res,
    );
  }
}
