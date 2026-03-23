import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePackageDto } from './dto/create-package.dto';
import { ResponseDto } from 'src/utils/response.dto';
import { UpdateOrderPackagesDTO } from './dto/update-package.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { USERROLES } from 'src/utils/enum';
import {
  AllPackagesResponseDTO,
  PackagesResponseDTO,
} from './dto/packages-response.dto';

@Controller('packages')
@ApiTags('orders_packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(USERROLES?.user?.id)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiOkResponse({
    description: 'Create packages response',
    type: PackagesResponseDTO,
  })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all packages response',
    type: AllPackagesResponseDTO,
  })
  findAll() {
    return this.packagesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get package details response',
    type: PackagesResponseDTO,
  })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update package details response',
    type: PackagesResponseDTO,
  })
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdateOrderPackagesDTO,
  ) {
    return this.packagesService.update(+id, updatePackageDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete packages response',
    type: ResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.packagesService.remove(+id);
  }
}
