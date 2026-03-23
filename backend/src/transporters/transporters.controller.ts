import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { UserDTO } from 'src/user/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FindManyTransporterDto } from './dto/findMany-transporter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllTransportersDTO } from './dto/AllTransporters.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { USERROLES } from 'src/utils/enum';
import { Roles } from 'src/auth/roles.decorator';
import { ResponseDto } from 'src/utils/response.dto';

@Controller('transporters')
@ApiTags('transporter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransportersController {
  constructor(
    private readonly transportersService: TransportersService,
    private prisma: PrismaService,
  ) {}

  @Post()
  create(@Body() createTransporterDto: UserDTO) {
    return this.transportersService.create(createTransporterDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'verified', required: false })
  @ApiQuery({ name: 'firstName', required: false })
  @ApiOkResponse({
    description: 'Get all transporters response',
    type: AllTransportersDTO,
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES?.admin?.id)
  async findAll(@Query() query: FindManyTransporterDto) {
    return this.transportersService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'response',
    type: ResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.transportersService.findOne(+id);
  }

  @Post('transporter-orders/:id')
  @ApiOkResponse({
    description: 'Paginated response',
    type: ResponseDto, // Ideally, update this to reflect paginated data (e.g., PaginatedResponseDto)
  })
  findTransporterOrders(
    @Param('id') id: string,
    @Query('page') page: number = 1, // Default page is 1
    @Query('limit') limit: number = 12, // Default limit is 10
  ) {
    return this.transportersService.findTransporterOrders(+id, +page, +limit);
  }

  @Post('transporter-accepted-orders/:id')
  @ApiOkResponse({
    description: 'Paginated response of accepted orders',
    type: ResponseDto,
  })
  findTransporterAcceptedOrders(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.transportersService.findTransporterAcceptedOrders(
      +id,
      +page,
      +limit,
    );
  }

  @Get('transporter-delivered-orders/:id')
  @ApiOkResponse({
    description: 'Paginated response of delivered orders',
    type: ResponseDto,
  })
  async findTransporterDeliveredOrders(
    @Param('id') id: string,
    @Query('page') page: number = 1, // Default page is 1
    @Query('limit') limit: number = 10, // Default limit is 10
  ) {
    return this.transportersService.findTransporterDeliveredOrders(
      +id,
      +page,
      +limit,
    );
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'response',
    type: ResponseDto,
  })
  update(@Param('id') id: string, @Body() updateTransporterDto: UserDTO) {
    return this.transportersService.update(+id, updateTransporterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportersService.remove(+id);
  }
}
