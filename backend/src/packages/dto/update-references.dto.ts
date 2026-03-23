import { ApiProperty } from "@nestjs/swagger";

export class UpdatePackagesReferences {
    @ApiProperty()
    id: number | undefined;

    @ApiProperty()
    referenceName: string;

    @ApiProperty()
    quantity: number;
}