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
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { emailAccountCreation, generateRandomPassword } from 'src/utils/utils';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { LogInMemberDto } from './dto/login-member.dto';
import { JwtService } from '@nestjs/jwt';
import {
  departmentRemovedFields,
  memberRemovedFields,
  memberSelectFields,
  teamRemovedFields,
} from 'src/utils/removed_field';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Teams } from 'src/teams/schema/teams.schema';
import { PayRoll } from 'src/pay-roll/schema/Payroll.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    @InjectModel('Teams') private teamsModel: Model<Teams>,
    @InjectModel('PayRoll') private payRollModel: Model<PayRoll>,
    private readonly emailService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // new create member with password sent in mail
  // @ TODO check if the department and team exists in their respective tables??
  async createMember(createMemberDto: CreateMemberDto, user) {
    const createdByData = await this.memberModel
      .findById(user._id)
      .select(memberSelectFields);
    const randomPassword = generateRandomPassword(10);
    // const randomPassword = '123456';

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    if (!hashedPassword)
      throw new InternalServerErrorException(
        'error occured while hashing password',
      );
    try {
      const userCreated = await this.memberModel.create({
        password: hashedPassword,
        createdBy: createdByData,
        ...createMemberDto,
      });
      const receivedData = userCreated.toObject();

      const template = emailAccountCreation(
        createMemberDto.name,
        createMemberDto.email,
        randomPassword,
      );
      //await this.emailService.sendEmail(createAdminDto.email, template)

      // TODO : comment before deployment. only for development
      const emailUser = this.configService.get<string>('EMAIL_USER_tester');
      await this.emailService.sendEmail(emailUser, template);

      const { password,currentSalary, ...userData } = receivedData;
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
      isDeleted: false,
    });
    if (!user) throw new NotFoundException('User with email doesnot exists');

    if (await bcrypt.compare(logInMemberDto.password, user.password)) {
      const payload = {
        _id: user._id,
        //email: user.email,
        role: user.role,
      };
      const accesstoken = this.jwtService.sign(payload);
      return {
        message: 'Welcome',
        accesstoken: accesstoken,
        name: user.name,
        role: user.role,
      };
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
      (await bcrypt.compare(resetPasswordDto.old_password, userData.password))
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

      return { message: `Password for ${userData.name} updated Successfully` };
    } else {
      throw new NotAcceptableException('OldPassword is incorrect');
    }
  }

  // used in auth  and forgot password // remove
  async findMemberByEmail(email: string) {
    const memberEmail = email.toLowerCase();
    const member = await this.memberModel
      .findOne({ email: memberEmail }, '-password')
      .populate({
        path: 'department',
        select: departmentRemovedFields,
        populate: { path: 'departmentHead', select: memberRemovedFields },
      })
      .populate({
        path: 'teams',
        select: teamRemovedFields,
        populate: { path: 'team_head', select: memberRemovedFields },
      })
      .populate({
        path: 'createdBy',
        select: memberRemovedFields,
      });
    return member;
  }

  //@ TODO remeove fields from data and populate
  async findAll() {
    return await this.memberModel
      .find({ isDeleted: false }, '-password')
      .populate({
        path: 'department',
        select: departmentRemovedFields,
        populate: { path: 'departmentHead', select: memberRemovedFields },
      })
      .populate({
        path: 'teams',
        select: teamRemovedFields,
        populate: { path: 'team_head', select: memberRemovedFields },
      });
    // .populate({
    //   path: 'createdBy',
    //   select: memberRemovedFields,
    // });
  }

  // @TODO good exception handling here
  async findMemberById(id: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const memberData = await this.memberModel
        .findOne({ _id: objectId, isDeleted: false }, '-password')
        .populate({
          path: 'department',
          select: departmentRemovedFields,
          populate: { path: 'departmentHead', select: memberRemovedFields },
        })
        .populate({
          path: 'teams',
          select: teamRemovedFields,
          populate: { path: 'team_head', select: memberRemovedFields },
        });
      // .populate({
      //   path: 'createdBy',
      //   select: memberRemovedFields,
      // });
      if (!memberData) {
        throw new NotFoundException('Member not found');
      }
      return memberData;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
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
      const data = await this.memberModel.findByIdAndUpdate(
        id,
        { ...updateMemberDto },
        { new: true },
      );
      const receivedData = data.toObject();

      const { password, ...restdata } = receivedData;
      return restdata;
    } catch (error) {
      throw new HttpException(
        'Failed to update',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Following code added by Zarib
  // @Done by Zarib: Completed If member is removed, check if he is head and remove from there,
  // check if he is part of a team and remove from there as well, and also remove the payroll related to that member
  async remove(id: string) {
    try {
      // Find the member to be removed
      const memberToRemove = await this.memberModel.findById(id);
      if (!memberToRemove) {
        throw new NotFoundException(
          'Member not found or does not exist: Wrong ID',
        );
      }

      // Check if the member is a team head
      if (memberToRemove.is_teamHead) {
        // Remove the member from the head position
        await this.teamsModel.updateMany(
          { team_head: memberToRemove._id },
          { $set: { team_head: null } },
        );
      }

      // Check if the member is part of any teams
      if (memberToRemove.teams && memberToRemove.teams.length > 0) {
        // Remove the member from all teams
        await this.teamsModel.updateMany(
          { members: memberToRemove._id },
          { $pull: { members: memberToRemove._id } },
        );
      }

      // // Soft delete the associated PayRoll by finding and deleting it
      // const payRollToDelete = await this.payRollModel.findOne({
      //   member: memberToRemove._id,
      // });

      // if (payRollToDelete) {
      //   await this.payRollModel.findByIdAndDelete(payRollToDelete._id);
      // }

      // Soft delete the member by setting isDeleted to true
      const updatedMember = await this.memberModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      return { message: 'Member Deactivated' };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
