import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { USERROLES } from '../utils/enum';

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
    // SECURITY: Basic input validation to prevent empty/injection payloads.
    if (!dto.message || !dto.subject) {
      return { success: false, error: 'Subject and message are required.' };
    }
    // Sanitize email — if not provided, set to null.
    const sanitizedEmail = dto.email ? dto.email.trim().toLowerCase() : null;
    try {
      await this.prisma.$executeRaw`
        INSERT INTO "contact_message" ("message", "subject", "email", "createdAt")
        VALUES (${dto.message}, ${dto.subject}, ${sanitizedEmail}, NOW())
      `;
      return { success: true };
    } catch (error) {
      // SECURITY: Do not expose internal error details.
      return { success: false, error: 'Erreur lors de l\'envoi du message.' };
    }
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USERROLES.admin.id, USERROLES.superadmin.id)
  @ApiOkResponse({})
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