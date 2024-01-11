import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { MembersService } from 'src/members/members.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'src/members/schema/members.schema';
import { Model } from 'mongoose';
import { User } from 'src/utils/interface';

@Injectable()
export class ForgetPasswordService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    private memberService: MembersService,
    private jwtService: JwtService,
    private readonly emailService: MailerService,
    private configService: ConfigService,
  ) {}

  async checkMail(email: string) {
    const memberData = await this.memberModel.findOne({ email: email });

    if (!memberData) {
      throw new NotFoundException('wrong email: user doesnot exists');
    } else {
      const res = this.createTokenAndMail(memberData);
      return res;
    }
  }

  async createTokenAndMail(data: Member) {
    try {
      const { _id, email, role } = data;
      const payload = { _id };

      const jwtToken = this.jwtService.sign(payload);
      const feLink = this.configService.get('FORGOT_PASSWORD_FE_LINK');
      const link = `${feLink}?token=${jwtToken}`;
      const emailBody = `<p>Click the button below to reset your password:</p>
                     <a href="${link}" style="text-decoration: none;">
                       <button style="padding: 10px; background-color: #3498db; color: white; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; transition: background-color 0.3s;">
                         Reset Password
                       </button>
                     </a>`;

      await this.emailService.sendEmail(email, emailBody);

      return { message: 'Check your emailssss' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const verifiedToken = this.jwtService.verify(token);
      if (!verifiedToken) {
        throw new NotAcceptableException('Token verification failed');
      }
      const memberData = await this.memberModel.findOne({
        _id: verifiedToken._id,
      });

      if (!memberData) {
        throw new NotFoundException('User doesnot exists');
      }

      return { bearertoken: token };
    } catch (error) {
      throw new NotAcceptableException(error.message);
    }
  }

  async resetForgotPassword(resetPasswordDTo: ResetPasswordDto, user: User) {
    try {
      const { new_password, confirm_password } = resetPasswordDTo;

      if (new_password !== confirm_password) {
        throw new NotAcceptableException('passwords donot match');
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
    
      const memberData = await this.memberModel.findByIdAndUpdate(
        { _id: user._id },
        { password: hashedPassword },
      );
      if (!memberData) {
        throw new NotAcceptableException('failed to update password');
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new NotAcceptableException(error.message);
    }
  }
}
