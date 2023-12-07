import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    const mailService = this.configService.get<string>('EMAIL_SERVICE');
    this.transporter = nodemailer.createTransport({
      service: mailService,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }

  async sendEmail(to: string, html: string) {
    const subject = 'TDC-Dashboard';
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html,
      });
      return;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        `error sending email ${error.message}`,
      );
    }
  }
}
