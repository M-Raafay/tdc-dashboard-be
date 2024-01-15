// src/earnings/update-earnings.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateEarningDto } from './create-earning.dto';
import {
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

// export class UpdateEarningDto extends PartialType(CreateEarningDto) {
export class UpdateEarningDto {
  @IsOptional()
  @IsNumber()
  totalOvertimeHours?: number;

  @IsOptional()
  @IsNumber()
  totalUnderTimeHours?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;
}
