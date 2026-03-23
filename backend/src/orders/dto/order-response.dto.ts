import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateOrderDtoRes } from './update-order.dto';

export class OrderDtoResponse extends PartialType(UpdateOrderDtoRes) {}

export class AllOrderDtoResponse {
  @ApiProperty({ type: () => [UpdateOrderDtoRes], isArray: true })
  orders?: UpdateOrderDtoRes[] | undefined | any;

  @ApiProperty()
  totalCount: number;
}
