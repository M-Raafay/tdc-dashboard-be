import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from 'src/members/schema/members.schema';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Member => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
