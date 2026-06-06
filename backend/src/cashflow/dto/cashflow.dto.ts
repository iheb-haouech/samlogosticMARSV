import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CashoutDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class BlockUserDto {
  @ApiProperty()
  @IsBoolean()
  blocked: boolean;
}

export class SettlementDto {
  @ApiProperty()
  @IsNumber()
  transporterId: number;

  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountReceived: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountToPayTransporter: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountToGiveClient: number;
}

export class ReceiveTransporterDto {
  @ApiProperty()
  @IsNumber()
  transporterId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  amountReceived: number;
}

export class PayClientDto {
  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  amountToGiveClient: number;
}
