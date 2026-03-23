import { ApiProperty } from '@nestjs/swagger';
import { UpdateClaimDto } from './update-claim.dto';

export class AllCLaimsRespDTO {
  @ApiProperty()
  totalCount?: number;

  @ApiProperty({ type: () => UpdateClaimDto, isArray: true })
  claims: [UpdateClaimDto] | undefined | any;
}

export class ClaimRespDTO {
  @ApiProperty()
  data: UpdateClaimDto;
}

