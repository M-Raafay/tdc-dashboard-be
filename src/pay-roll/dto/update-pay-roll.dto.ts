// payroll-update.dto.ts
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePayRollDto } from './create-pay-roll.dto';

export class UpdatePayRollDto extends PartialType(CreatePayRollDto) {
  @IsMongoId()
  @IsOptional()
  member?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  accountTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(13, { message: 'CNIC must be at least 13 characters long' })
  @MaxLength(13, { message: 'CNIC must be at most 13 characters long' })
  cnic?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  accountNo?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  netSalary?: number;

  @IsMongoId()
  @IsOptional()
  department?: string;
}
