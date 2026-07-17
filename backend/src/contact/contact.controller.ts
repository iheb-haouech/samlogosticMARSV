import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { USERROLES } from '../utils/enum';
import { RoleGuard } from '../auth/role.guard';

class ContactMessageDto {
  message: string;
  subject: string;
  email?: string;
}

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private prisma: PrismaService) {}

  @Post('message')
  @ApiOkResponse({ type: ContactMessageDto })
  async sendContactMessage(@Body() dto: ContactMessageDto) {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO "contact_message" ("message", "subject", "email", "createdAt")
        VALUES (${dto.message}, ${dto.subject}, ${dto.email || null}, NOW())
      `;
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ })
  async getMessages(@Body() query: { page?: number }) {
    const page = query.page || 1;
    const messages = await this.prisma.$queryRaw`
      SELECT * FROM "contact_message"
      ORDER BY "createdAt" DESC
      LIMIT 20 OFFSET ${(page - 1) * 20}
    `;
    return { success: true, data: messages };
  }
}