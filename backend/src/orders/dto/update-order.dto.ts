import { ApiProperty } from '@nestjs/swagger';
import { UpdateOrderRecipientDTO } from './update-recipient.dto';
import { UpdateOrderPackagesDTO } from 'src/packages/dto/update-package.dto';
import { UpdateOrderSourceDTO } from './update-source.dto';

export class UpdateOrderTransporterDto {
  @ApiProperty()
  deliveredByUserId: number;
}

export class UpdateOrderDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  totalLength: number;

  @ApiProperty()
  totalWidth: number;

  @ApiProperty()
  totalHeight: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  clientPrice: number;

  @ApiProperty()
  transporterPrice: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  shipmentPrice: number;

  @ApiProperty({ isArray: false })
  refrences: string[];

  @ApiProperty()
  orderStatusId: number;

  @ApiProperty()
  deliveredByUserId: number;

  @ApiProperty({
    type: () => UpdateOrderSourceDTO,
    isArray: false,
  })
  source?: UpdateOrderSourceDTO | undefined | any;

  @ApiProperty({
    type: () => UpdateOrderRecipientDTO,
    isArray: false,
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
  pods: any;
}
export class UpdateOrderDtoRes extends UpdateOrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  deliveredBy: any;
}
