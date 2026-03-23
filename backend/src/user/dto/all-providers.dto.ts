import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AllProvidersDTO {
  @ApiProperty()
  data: any;
}

export class FindManyProvidersDto {
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: string;

  @ApiPropertyOptional({ description: 'Limit of items per page' })
  limit?: string;

  @ApiPropertyOptional({ description: 'Email filter' })
  email?: string;

  @ApiPropertyOptional({ description: 'Verification status filter' })
  verified?: string;
}

export class GetProviderInvoiceDto {
  @ApiPropertyOptional()
  id?: number;

  @ApiPropertyOptional({ default: new Date() })
  from?: Date;

  @ApiPropertyOptional({ default: new Date() })
  to?: Date;

  @ApiPropertyOptional()
  invoiceType?: string;
}
