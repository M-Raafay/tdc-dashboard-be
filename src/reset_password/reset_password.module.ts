import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset_password.service';
import { ResetPasswordController } from './reset_password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schema/resetToken.schema';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[MongooseModule.forFeature([{name: 'Token', schema: TokenSchema}]),MembersModule, AdminModule],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule {}
