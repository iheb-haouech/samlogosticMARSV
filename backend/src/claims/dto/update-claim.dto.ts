import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClaimDto } from './create-claim.dto';

export class UpdateClaimMsgPhotosDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  url?: string;
}

export class UpdateClaimMsgDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  messageContent?: string;

  @ApiProperty()
  senderId?: number;

  @ApiProperty({ type: () => UpdateClaimMsgPhotosDto, isArray: true })
  photos: [UpdateClaimMsgPhotosDto] | undefined | any;
}

export class UpdateClaimDto {
  @ApiProperty()
  statusId?: number;
}

export class UpdateRespDTO {
  @ApiProperty({ type: () => UpdateClaimDto, isArray: true })
  data: [UpdateClaimDto] | undefined | any;
}
