import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindManyTransporterDto {
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: string;

  @ApiPropertyOptional({ description: 'Limit of items per page' })
  limit?: string;

  @ApiPropertyOptional({ description: 'firstName filter' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Verification status filter' })
  verified?: string;
}
