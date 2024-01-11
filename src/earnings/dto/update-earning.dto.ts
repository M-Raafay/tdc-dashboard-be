// src/earnings/update-earnings.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateEarningDto } from './create-earning.dto';
import { IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateEarningDto extends PartialType(CreateEarningDto) {
  @IsOptional()
  @IsNumber()
  readonly totalOvertimeHours?: number;

  @IsOptional()
  @IsNumber()
  readonly totalUnderTimeHours?: number;

  @IsOptional()
  @IsArray()
  readonly projectsAssigned?: string[];

  @IsOptional()
  @IsArray()
  readonly projectsWorkedOn?: string[];

  @IsOptional()
  @IsNumber()
  readonly contractedHours?: number;

  @IsOptional()
  @IsNumber()
  readonly totalDeductions?: number;
}
