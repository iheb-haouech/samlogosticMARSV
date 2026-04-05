import { ApiProperty } from '@nestjs/swagger';

export class CreateClaimMsgPhotosDto {
  @ApiProperty()
  url?: string;
}

export class CreateClaimMsgDto {
  @ApiProperty()
  messageContent?: string;

  @ApiProperty()
  senderId?: number;

  @ApiProperty({ type: () => CreateClaimMsgPhotosDto, isArray: true })
  photos: [CreateClaimMsgPhotosDto] | undefined | any;
}


export class AddClaimMsgDto {
  @ApiProperty()
  messageContent?: string;

  @ApiProperty()
  claimId?: number;

  @ApiProperty()
  senderId?: number;
  

  @ApiProperty({ type: () => CreateClaimMsgPhotosDto, isArray: true })
  photos: [CreateClaimMsgPhotosDto] | undefined | any;
}

export class CreateClaimDto {
  @ApiProperty()
  subject?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  statusId?: number;

  @ApiProperty()
  orderId?: string;

  @ApiProperty({ type: () => CreateClaimMsgDto, isArray: true })
  messages: [CreateClaimMsgDto] | undefined | any;
}

export class CreateRespDTO {
  @ApiProperty({ type: () => CreateClaimDto, isArray: true })
  data: [CreateClaimDto] | undefined | any;
}
