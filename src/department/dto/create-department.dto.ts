import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsMongoId()
  departmentHead: string;
}
