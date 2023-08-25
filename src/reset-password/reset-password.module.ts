import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schema/resetToken.schema';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports:[MongooseModule.forFeature([{name: 'Token', schema: TokenSchema}]),MembersModule, AdminModule],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule {}
