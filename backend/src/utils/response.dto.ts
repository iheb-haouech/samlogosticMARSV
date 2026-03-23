import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  data: any;
}

export class StatisticsDTO {
  @ApiProperty()
  totalWaitingOrders: any;

  @ApiProperty()
  totalTransitOrders: any;

  @ApiProperty()
  totalLivredOrders: any;

  @ApiProperty()
  totalCanceledOrders: any;

  @ApiProperty()
  totalAcceptedProviders: any;

  @ApiProperty()
  totalWaitingProviders: any;

  @ApiProperty()
  totalAcceptedTransporters: any;

  @ApiProperty()
  totalWaitingTransporters: any;
}
