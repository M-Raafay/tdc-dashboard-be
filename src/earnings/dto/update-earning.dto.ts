// src/earnings/update-earnings.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateEarningDto } from './create-earning.dto';
import { IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateEarningDto extends PartialType(CreateEarningDto) {
  @IsOptional()
  @IsNumber()
  totalOvertimeHours?: number;

  @IsOptional()
  @IsNumber()
  totalUnderTimeHours?: number;

  @IsOptional()
  @IsArray()
  projectsAssigned?: string[];

  @IsOptional()
  @IsArray()
  projectsWorkedOn?: string[];

  // @IsOptional()
  // @IsNumber()
  // readonly contractedHours?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;
}
