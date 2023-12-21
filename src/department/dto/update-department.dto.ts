import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import { IsMongoId } from 'class-validator';

export class UpdateDepartmentDto {
  @IsMongoId()
  departmentHead: string;
}
