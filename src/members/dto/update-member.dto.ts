import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../schema/members.schema';

export class UpdateMemberDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(14)
  contactNumber: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsMongoId()
  department: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  teams: string[];

  @IsString()
  @IsOptional()
  emergencyContactName: string;

  @IsString()
  @IsOptional()
  emergencyContactNumber: string;

  @IsString()
  @IsOptional()
  emergencyContactRelation: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  currentSalary?: number;
}
