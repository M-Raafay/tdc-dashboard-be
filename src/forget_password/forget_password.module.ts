import { Module } from '@nestjs/common';
import { ForgetPasswordService } from './forget_password.service';
import { ForgetPasswordController } from './forget_password.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MembersModule } from 'src/members/members.module';
import { AdminModule } from 'src/admin/admin.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [MembersModule, AdminModule,MailerModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
    inject: [ConfigService],
  }),
 ],
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService]
})
export class ForgetPasswordModule {}
