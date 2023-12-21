import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUrl,
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
  emailSecondary: string;

  @IsPhoneNumber()
  contactNumber: string;

  //Platform from which client contacted
  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsDate()
  dateContacted: Date;

  //region in which client is located
  @IsString()
  regionLocated: string;

  // for storing link to contact to client(communicating platform)
  @IsUrl()
  contactPlatformLink1: string;

  // for storing link to contact to client(communicating platform)
  @IsUrl()
  contactPlatformLink2: string;
}
