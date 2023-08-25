import { Module, forwardRef } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/members.schema';
import { ProjectsModule } from 'src/projects/projects.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/authenticated.guard';
import { APP_GUARD } from '@nestjs/core';
import { LocalStrategy } from 'src/auth/local.strategy';

@Module({
  imports : [MongooseModule.forFeature([{name: 'Member', schema: MemberSchema}]), ProjectsModule,
  //forwardRef(() => AuthModule),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
    inject: [ConfigService],
  }),
],
  controllers: [MembersController],
  providers: [MembersService,RolesGuard  ],
  exports:[MembersService]
})
export class MembersModule {}
