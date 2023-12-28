import { Module } from '@nestjs/common';
import { ForgetPasswordService } from './forget_password.service';
import { ForgetPasswordController } from './forget_password.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MembersModule } from 'src/members/members.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { MemberSchema } from 'src/members/schema/members.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MembersModule, //@remove
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: configService.get<string>('FORGOT_PASSWORD_JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService],
})
export class ForgetPasswordModule {}
