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
import { ClaimsService } from './claims.service';
import {
  AddClaimMsgDto,
  CreateClaimDto,
  CreateRespDTO,
} from './dto/create-claim.dto';
import { UpdateClaimDto, UpdateRespDTO } from './dto/update-claim.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllCLaimsRespDTO, ClaimRespDTO } from './dto/claim.dto';
import { ResponseDto } from 'src/utils/response.dto';
import { AuthUserJWT } from 'src/utils/auth-user-jwt.decorator';

@Controller('claims')
@ApiTags('claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  addMessage(@Body() addClaimDto: AddClaimMsgDto) {
    return this.claimsService.createMessage(addClaimDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'update claim response',
    type: UpdateRespDTO,
  })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(+id, updateClaimDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'delete claim response',
    type: ResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.claimsService.remove(+id);
  }
}
