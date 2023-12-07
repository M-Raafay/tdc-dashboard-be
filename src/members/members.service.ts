import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schema/members.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { ProjectsService } from 'src/projects/projects.service';
//import { SignUpDto } from './dto/signup-member.dto';
import * as bcrypt from 'bcrypt';
import { generateEmailContent, generateRandomPassword } from 'src/utils/utils';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { LogInMemberDto } from './dto/login-member.dto';
import { JwtService } from '@nestjs/jwt';
import { memberRemovedFields } from 'src/utils/removed_field';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    private readonly emailService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // new create member with password sent in mail
  async createMember(createMemberDto: CreateMemberDto, user) {
    const randomPassword = generateRandomPassword(10);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    if (!hashedPassword)
      throw new InternalServerErrorException(
        'error occured while hashing password',
      );
    try {
      const userCreated = await this.memberModel.create({
        password: hashedPassword,
        createdBy: user._id,
        ...createMemberDto,
      });
      const receivedData = userCreated.toObject();

      const template = generateEmailContent(
        createMemberDto.name,
        createMemberDto.email,
        randomPassword,
      );
      //await this.emailService.sendEmail(createAdminDto.email, template)

      // TODO : REMOVE before deployment. only for testing
      const emailUser = this.configService.get<string>('EMAIL_USER_tester');
      await this.emailService.sendEmail(emailUser, template);

      const { password, ...userData } = receivedData;
      return userData;
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException(
          'Duplicate email error: The resource already exists.',
          error.message,
        );
      }
      throw new InternalServerErrorException(
        `error occurred.  ${error.message}`,
      );
    }
  }

  async login(logInMemberDto: LogInMemberDto) {
    const user = await this.memberModel.findOne({
      email: logInMemberDto.email,
    });
    if (!user) throw new NotFoundException('User with email doesnot exists');

    if (await bcrypt.compare(logInMemberDto.password, user.password)) {
      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };
      const accesstoken = this.jwtService.sign(payload);
      return { message: 'Welcome', accesstoken: accesstoken };
    } else {
      throw new BadRequestException('Wrong Credentials');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, user) {
    if (resetPasswordDto.new_password !== resetPasswordDto.confirm_password) {
      throw new NotAcceptableException(
        'New password and Confirm password doesnot match',
      );
    }
    const userData = await this.memberModel.findById(user._id);
    if (
      userData &&
      (await bcrypt.compare( resetPasswordDto.old_password , userData.password))
    ) {
      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.new_password,
        10,
      );
      if (!hashedPassword) {
        throw new InternalServerErrorException(
          'error occured while updating password',
        );
      }
      const memberPasswordUpdate = await this.memberModel.findByIdAndUpdate(
        { _id: user._id },
        { password: hashedPassword },
        { new: true },
      );

      return { message: `Password for ${user.name} updated Successfully` };
    } else {
      throw new NotAcceptableException('OldPassword is incorrect');
    }
  }

  // used in auth
  async findMemberByEmail(email: string) {
    const memberEmail = email.toLowerCase();
    const member = await this.memberModel
      .findOne({ email: memberEmail })
      .populate('createdBy', memberRemovedFields)
      .select(memberRemovedFields);
    return member;
  }

  // //used in jwt strategy
  // async findMemberById(email: string) {
  //   const memberEmail = email.toLowerCase();
  //   const member = await this.memberModel.findOne({ email: memberEmail });
  //   return member;
  // }

  async resetMemberPassword(id: string, passwordData: object) {
    const oldData = await this.memberModel.findById(id);
    const previousPassword = oldData.password;
    const isMatch = await bcrypt.compare(
      passwordData['old_password'],
      previousPassword,
    );
    if (!isMatch) {
      throw new NotAcceptableException('oldpassword doesnot match');
    }

    const hashedPassword = await bcrypt.hash(passwordData['new_password'], 10);
    if (!hashedPassword) {
      throw new InternalServerErrorException('error in password');
    }
    try {
      const member = await this.memberModel.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword },
        { new: true },
      );

      if (!member) {
        throw new InternalServerErrorException('error in updating password');
      }

      return member;
    } catch (error) {
      throw new HttpException(
        'couldnot reset password',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async findByIdAndUpdatePassword(id: string, new_password: string) {
    const data = await this.memberModel.findById(id);
    console.log(data);
    if (!data) {
      throw new NotFoundException('admin not found');
    }

    const updatePassword = await this.memberModel.findByIdAndUpdate(
      { _id: id },
      { password: new_password },
      { new: true },
    );
    if (!updatePassword) {
      throw new NotFoundException('admin not found : password not updated');
    }

    return updatePassword;
  }

  async findAll() {
    // const user = req.user;
    // const { role } = req.user; // use this to achieve user.role add try catch

    // if (role === 'admin' || role === 'super') {
    //   return await this.memberModel.find({}, '-password').populate('projects');
    // } else {
    //   return await this.memberModel.find({}, '-password').populate('projects', {
    //     coordinator: 0,
    //     platform: 0,
    //     client: 0,
    //     consultant: 0,
    //     cost: 0,
    //     start_date: 0,
    //     end_date: 0,
    //     createdAt: 0,
    //   }); // adjust fields
    // }
    return await this.memberModel.find().populate('createdBy');
  }

  async findOneById(id: string) {
    try {
      const memberData = await this.memberModel.findById(
        { _id: id },
        '-password',
      );
      if (!memberData) {
        throw new NotFoundException('Member not found');
      }
      return memberData;
    } catch (error) {
      throw new HttpException(
        'Failed to create member',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const user = await this.memberModel.findById(id);
    if (!user) {
      throw new HttpException(
        'Member not found OR doesnot exists : Wrong ID',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      //const data =await this.memberModel.findByIdAndUpdate(id, {$set : updateData,$push : {projects}} ,{new:true})
      const data = await this.memberModel.findByIdAndUpdate(
        id,
        { $set: updateMemberDto },
        { new: true },
      );
      const receivedData = data.toObject();

      const { password, ...restdata } = receivedData;
      //    console.log(password,'#####', restdata);

      // if(data===null){
      //   console.log('dcs');

      //   throw new HttpException('Member not found OR doesnot exists : Wrong ID', HttpStatus.NOT_FOUND);
      // }

      // console.log(data);
      return restdata;
    } catch (error) {
      throw new HttpException(
        'Failed to update',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const member = await this.memberModel.findByIdAndDelete({ _id: id });
      if (!member) {
        throw new NotFoundException(
          'Member not found OR doesnot exists : Wrong ID',
        );
      }
      return { message: 'Member Deleted ' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
