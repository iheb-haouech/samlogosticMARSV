import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseDto } from 'src/utils/response.dto';

@Controller('mail')
@ApiTags('mail')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiOkResponse({
  description: 'mail response',
  type: ResponseDto,
})
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    await this.mailService.sendEmail();
    return { message: 'Mail sent' };
  }
}
