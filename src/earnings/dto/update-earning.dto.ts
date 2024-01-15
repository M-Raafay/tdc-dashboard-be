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

export class UpdateEarningDto extends PartialType(CreateEarningDto) {
  @IsOptional()
  @IsNumber()
  totalOvertimeHours?: number;

  @IsOptional()
  @IsNumber()
  totalUnderTimeHours?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // month?: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // year?: number;

  // @IsNotEmpty()
  // @IsString()
  // department?: string;

  // @IsOptional()
  // @IsArray()
  // projectsAssigned?: string[];

  // @IsOptional()
  // @IsArray()
  // projectsWorkedOn?: string[];
}
