import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MembersService } from 'src/members/members.service';
import { jwtUser } from 'src/utils/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private memberService: MembersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }
  async validate(payload: jwtUser) {
    const user = await this.memberService.findMemberById(payload._id);
    
    return {
      _id: user._id,
      role: user.role,
    };
  }
}
