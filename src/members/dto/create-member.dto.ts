import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../schema/members.schema';

export class CreateMemberDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsMongoId()
  department: string;

  @IsMongoId()
  teams: string;

  // @IsBoolean()
  // is_departmentHead: boolean;

  // @IsBoolean()
  // is_teamHead: boolean;

  // @IsMongoId()
  // createdBy: string;
}
