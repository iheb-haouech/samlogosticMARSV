import { ApiProperty } from '@nestjs/swagger';
import { PackagesReferences } from './create-references.dto';

export class CreateOrderPackagesDTO {
  @ApiProperty()
  weight: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  length: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: () => PackagesReferences, isArray: true })
  references: [PackagesReferences] | undefined | any;
}

export class CreatePackageDto extends CreateOrderPackagesDTO {
  @ApiProperty()
  orderId: string;
}
