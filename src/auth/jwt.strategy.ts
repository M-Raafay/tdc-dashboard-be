import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt , Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService : ConfigService) {
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : configService.get('SECRET')
        });
      }

      async validate(payload :any){
        // this only returns data,,,actual validation is done by Super method in constructor

        console.log(payload);
        
        // use service to get actual data of admin
        return {
            _id : payload.id,
            username : payload.name,
            role : payload.role
        }

      }

}