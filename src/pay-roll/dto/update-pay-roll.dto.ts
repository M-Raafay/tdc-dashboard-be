// payroll-update.dto.ts
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePayRollDto } from './create-pay-roll.dto';

export class UpdatePayRollDto extends PartialType(CreatePayRollDto) {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  member?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  accountTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cnic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  accountNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  netSalary?: number;

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  department?: string;
}
