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
import { ResponseDto } from '../utils/response.dto';
import { UpdateOrderPackagesDTO } from './dto/update-package.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { USERROLES } from '../utils/enum';
import {
  AllPackagesResponseDTO,
  PackagesResponseDTO,
} from './dto/packages-response.dto';

@Controller('packages')
@ApiTags('orders_packages')
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @Roles(USERROLES.user.id)
  @ApiOkResponse({
    description: 'Get all packages response',
    type: AllPackagesResponseDTO,
  })
  findAll() {
    return this.packagesService.findAll();
  }

  @Post()
  @ApiOkResponse({
    description: 'Create packages response',
    type: PackagesResponseDTO,
  })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
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
