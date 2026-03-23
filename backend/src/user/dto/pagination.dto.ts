import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;
}
