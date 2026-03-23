import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderPackagesDTO } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  create(createPackageDto: CreatePackageDto) {
    return this.prisma.order_packages.create({
      data: {
        ...createPackageDto,
        references: createPackageDto?.references
          ? {
              createMany: {
                data: createPackageDto?.references,
              },
            }
          : undefined,
      },
      include: {
        references: true,
      },
    });
  }

  async findAll() {
    const totalCount = await this.prisma.order_packages.count();
    const packages = await this.prisma.order_packages.findMany({
      include: {
        references: true,
      },
    });
    return { packages, totalCount };
  }

  findOne(id: number) {
    return this.prisma.order_packages.findUnique({ where: { id } });
  }

  update(id: number, updatePackageDto: UpdateOrderPackagesDTO) {
    return this.prisma.order_packages.update({
      where: { id },
      data: updatePackageDto,
    });
  }

  remove(id: number) {
    return this.prisma.order_packages.delete({ where: { id } });
  }
}
