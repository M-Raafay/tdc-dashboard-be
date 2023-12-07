import { IsMongoId, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  department_head: string;
}
