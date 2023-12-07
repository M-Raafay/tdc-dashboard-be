import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LogInMemberDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  // @TODO set password validation w.r.t regex and update reset password
  @IsString()
  @MinLength(3)
  password:string

}
