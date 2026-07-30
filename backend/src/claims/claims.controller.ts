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
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '../microservices/cache.interceptor';
import { RoleRateLimitGuard } from '../microservices/rate-limit.guard';
import { ClaimsService } from './claims.service';
import {
  AddClaimMsgDto,
  CreateClaimDto,
  CreateRespDTO,
} from './dto/create-claim.dto';
import { UpdateClaimDto, UpdateRespDTO } from './dto/update-claim.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllCLaimsRespDTO, ClaimRespDTO } from './dto/claim.dto';
import { ResponseDto } from '../utils/response.dto';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { USERROLES } from '../utils/enum';

@Controller('claims')
@ApiTags('claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleRateLimitGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOkResponse({
    description: 'create claim response',
    type: CreateRespDTO,
  })
  create(
    @AuthUserJWT() userToken: string | undefined,
    @Body() createClaimDto: CreateClaimDto,
  ) {
    return this.claimsService.create(userToken, createClaimDto);
  }

  @Post('/add-message')
  @ApiOkResponse({
    description: 'add claim message response',
    type: ResponseDto,
  })
  addMessage(@AuthUserJWT() userToken: string | undefined, @Body() addClaimDto: AddClaimMsgDto) {
    // SECURITY: Pass user token so the service can verify the user owns the claim or is admin.
    return this.claimsService.createMessage(userToken, addClaimDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('claims:list')
  @CacheTTL(30)
  @ApiOkResponse({
    description: 'all claims response',
    type: AllCLaimsRespDTO,
  })
  findAll(
    @AuthUserJWT() userToken: string | undefined,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('id') id: string,
    @Query('status') status: string,
  ) {
    return this.claimsService.findAll(userToken, +page, +limit, id, status);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'get claim response',
    type: ClaimRespDTO,
  })
  findOne(@Param('id') id: string, @AuthUserJWT() userToken: string | undefined) {
    // SECURITY: Pass user token for ownership check.
    return this.claimsService.findOne(+id, userToken);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'update claim response',
    type: UpdateRespDTO,
  })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto, @AuthUserJWT() userToken: string | undefined) {
    // SECURITY: Pass user token for ownership check.
    return this.claimsService.update(+id, updateClaimDto, userToken);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({
    description: 'delete claim response',
    type: ResponseDto,
  })
  remove(@Param('id') id: string) {
    // SECURITY: Only admins/superadmins can delete claims.
    return this.claimsService.remove(+id);
  }
}
