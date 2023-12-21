import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentHead: string;
}
