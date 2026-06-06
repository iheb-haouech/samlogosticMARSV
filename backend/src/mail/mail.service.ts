import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor() {}

  async sendEmail() {
    const url = `https://google.com`;

    return {
      success: true,
      message: 'Email sending disabled',
      data: {
        name: 'iheb',
        url,
      },
    };
  }
}