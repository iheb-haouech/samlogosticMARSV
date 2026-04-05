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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  AllProvidersDTO,
  FindManyProvidersDto,
  GetProviderInvoiceDto,
} from './dto/all-providers.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { USERROLES } from 'src/utils/enum';
import { Roles } from 'src/auth/roles.decorator';
import { PaginationDTO } from './dto/pagination.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  create(@Body() createUserDto: UserDTO) {
    return this.userService.create(createUserDto);
  }
  @Get('/invoices')
  getAllInvoices(@Query() query: any) {
    return this.userService.getAllInvoices(query);
  }
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('all-providers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'verified', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiOkResponse({
    description: 'Get all providers response',
    type: AllProvidersDTO,
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.admin?.id)
  async findAllProviders(@Query() query: FindManyProvidersDto) {
    return this.userService.findAllProviders(query);
  }

  @Get('/invoice-pdf')
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
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(3)
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
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
  update(@Param('id') id: string, @Body() userDto: UserDTO) {
    return this.userService.updateUser(+id, userDto);
  }

  @Patch('verfieUser/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Post('/generate-provider-invoice')
  @ApiOkResponse({
    description: 'generate provider invoice in specific period',
    type: ResponseDto,
  })
  getProvidersInvoice(@Body() query: GetProviderInvoiceDto, @Res() res: any) {
    console.log('ccccccccccccc', query);
    return this.userService.getProvidersInvoice(
      +query?.id,
      query?.from,
      query?.to,
      +query?.invoiceType,
      res,
    );
  }
}
