import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderRecipientDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  companyName: string | undefined;

  @ApiProperty()
  phone: string | undefined;

  @ApiProperty()
  city: string | undefined;

  @ApiProperty()
  country: string | undefined;

  @ApiProperty()
  streetAddress: string | undefined;

  @ApiProperty()
  secondAddress: string | undefined;

  @ApiProperty()
  zipCode: string | undefined;

  @ApiProperty()
  email: string | undefined;
}
