import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  emailSecondary: string;

  @IsString()
  @MinLength(10)
  @MaxLength(14)
  @IsOptional()
  contactNumber: string;

  //Platform from which client contacted
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  platform: string;

  @IsDateString()
  dateContacted: Date;

  //region in which client is located
  @IsString()
  @IsOptional()
  regionLocated: string;

  // for storing link to contact to client(communicating platform)
  @IsUrl()
  @IsOptional()
  contactPlatformLink1: string;

  // for storing link to contact to client(communicating platform)
  @IsUrl()
  @IsOptional()
  contactPlatformLink2: string;
}
