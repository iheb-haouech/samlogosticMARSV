import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail() {
    const url = `https://google.com`;

    return await this.mailerService.sendMail({
      to: 'ihebhaouech27@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Confirm Your Account – Vanlog',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: 'Hassen',
        url,
      },
    });
  }
}
