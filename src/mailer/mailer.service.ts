import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {

    private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'm.rafay28749@gmail.com',
        pass: 'bbheylvoyuxwvktk',
      },
    });
  }

  async sendEmail(to: string, html: string) {
    const subject = 'Forget Password request for TDC-Dashboard'
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html,
      });
      return 
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

}
