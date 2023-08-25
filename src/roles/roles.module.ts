// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// e
// @Module({})
// export class RolesModule {

//     imports:[ 
//         JwtModule.registerAsync({
//            imports: [ConfigModule],
//            useFactory: async (configService: ConfigService) => ({
//              secret: configService.get<string>('SECRET'),
//              signOptions: { expiresIn: '1h' },
//            }),
//            inject: [ConfigService],
//          }),
//      ]
// }
