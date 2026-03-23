import { ApiProperty } from "@nestjs/swagger";

export class PackagesReferences {
    @ApiProperty()
    referenceName: string;
  
    @ApiProperty()
    quantity: number;
  }