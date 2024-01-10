import { Module, forwardRef } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/members.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/roles/roles.guard';
import { MailerModule } from 'src/mailer/mailer.module';
import { TeamsSchema } from 'src/teams/schema/teams.schema';
import { PayrollSchema } from 'src/pay-roll/schema/Payroll.schema';

@Module({
  imports: [
    MailerModule,
    MongooseModule.forFeature([
      { name: 'Member', schema: MemberSchema },
      { name: 'Teams', schema: TeamsSchema },
      { name: 'PayRoll', schema: PayrollSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MembersController],
  providers: [MembersService, RolesGuard],
  exports: [MembersService],
})
export class MembersModule {}
