import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersModule } from './members/members.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ForgetPasswordModule } from './forget_password/forget_password.module';
import { MailerModule } from './mailer/mailer.module';
import { DepartmentModule } from './department/department.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('DATABASE_URL');
        return {
          uri: mongoUri,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MembersModule,
    ProjectsModule,
    AuthModule,
    ForgetPasswordModule,
    MailerModule,
    DepartmentModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
