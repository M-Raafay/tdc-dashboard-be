import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersModule } from './members/members.module';
import { ProjectsModule } from './projects/projects.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { AuthGuard } from './auth/authenticated.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
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
    AdminModule,
    AuthModule,
    ResetPasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService,
    // when jwt expires it wont allow requests?
    // {
    //   provide : APP_GUARD,
    //   useClass:   JwtAuthGuard
    // },
  {
    provide : APP_GUARD,
    useClass:   RolesGuard
  }
],
})
export class AppModule {}
