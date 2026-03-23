import { ApiProperty, PartialType } from "@nestjs/swagger";
import { UpdateOrderPackagesDTO } from "./update-package.dto";

export class PackagesResponseDTO extends PartialType(UpdateOrderPackagesDTO) { }

export class AllPackagesResponseDTO {
    @ApiProperty({ type: () => UpdateOrderPackagesDTO, isArray: false })
    packages?: UpdateOrderPackagesDTO | undefined | any;

    @ApiProperty()
    totalCount: number
}
