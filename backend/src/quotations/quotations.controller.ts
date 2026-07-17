import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';

class CreateQuotationDto {
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  dimensions: string;
  description: string;
  transportType: string;
}

@ApiTags('quotations')
@Controller('quotations')
export class QuotationsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CreateQuotationDto })
  async createQuotation(
    @AuthUserJWT() userToken: any,
    @Body() dto: CreateQuotationDto,
  ) {
    const userId = userToken?.userId;
    const result = await this.prisma.$queryRaw`
      INSERT INTO quotation ("pickupAddress", "deliveryAddress", weight, dimensions, description, "transportType", status, "userId", "createdAt")
      VALUES (${dto.pickupAddress}, ${dto.deliveryAddress}, ${dto.weight}, ${dto.dimensions || null}, ${dto.description || null}, ${dto.transportType || null}, 'pending', ${userId}, NOW())
      RETURNING *
    `;
    return { success: true, data: result };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserQuotations(
    @AuthUserJWT() userToken: any,
    @Query('page') page: string,
  ) {
    const userId = userToken?.userId;
    const quotations = await this.prisma.$queryRaw`
      SELECT * FROM quotation WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT 10 OFFSET ${((+page || 1) - 1) * 10}
    `;
    return { success: true, data: quotations };
  }
}