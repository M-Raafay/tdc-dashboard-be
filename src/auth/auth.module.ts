import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/roles/roles.guard';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [
    PassportModule,
    MembersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '10h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
})
export class AuthModule {}
