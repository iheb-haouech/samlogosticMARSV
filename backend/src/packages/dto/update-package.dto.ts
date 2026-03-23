import { ApiProperty } from '@nestjs/swagger';
import { UpdatePackagesReferences } from './update-references.dto';

export class UpdateOrderPackagesDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  length: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({
    type: () => UpdatePackagesReferences,
    isArray: true,
    required: false,
  })
  references?: UpdatePackagesReferences[] | any;
}
