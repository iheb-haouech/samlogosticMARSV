// backend/src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsArray, Min } from 'class-validator'; // ✅ CORRECT
import { Type } from 'class-transformer';
import { CreateOrderPackagesDTO } from 'src/packages/dto/create-package.dto';
import { OrderRecipientDTO } from './create-recipient.dto';
import { OrderSourceDTO } from './create-source.dto';

export class CreateOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
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

  @ApiProperty({ isArray: true, required: false })
  @IsOptional()
  @IsArray()
  refrences?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  createdByUserId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  deliveredByUserId?: number;

  @ApiProperty({ type: () => OrderSourceDTO, required: false })
  @IsOptional()
  @Type(() => OrderSourceDTO)
  source?: OrderSourceDTO;

  @ApiProperty({ type: () => OrderRecipientDTO, required: false })
  @IsOptional()
  @Type(() => OrderRecipientDTO)
  recipient?: OrderRecipientDTO;

  @ApiProperty({ type: () => [CreateOrderPackagesDTO], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => CreateOrderPackagesDTO)
  packages?: CreateOrderPackagesDTO[];

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  pods?: any;
}
