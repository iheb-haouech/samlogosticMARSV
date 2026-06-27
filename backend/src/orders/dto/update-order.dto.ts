import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { UpdateOrderRecipientDTO } from './update-recipient.dto';
import { UpdateOrderPackagesDTO } from '../../packages/dto/update-package.dto';
import { UpdateOrderSourceDTO } from './update-source.dto';

export class UpdateOrderTransporterDto {
  @ApiProperty()
  deliveredByUserId: number;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalWeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalLength?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalWidth?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalHeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  clientPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transporterPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipmentPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  refrences?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  orderStatusId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  deliveredByUserId?: number;

  @ApiProperty({
    type: () => UpdateOrderSourceDTO,
    required: false,
  })
  source?: UpdateOrderSourceDTO | undefined | any;

  @ApiProperty({
    type: () => UpdateOrderRecipientDTO,
    required: false,
  })
  recipient?: UpdateOrderRecipientDTO | undefined | any;

  @ApiProperty({
    type: () => UpdateOrderPackagesDTO,
    isArray: true,
    required: false,
  })
  packages?: UpdateOrderPackagesDTO | undefined | any;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  pods?: any;
}
export class UpdateOrderDtoRes extends UpdateOrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  deliveredBy: any;
}
