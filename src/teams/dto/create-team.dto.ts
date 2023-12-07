import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  technology: string;

  @IsMongoId()
  department: string;

  @IsMongoId()
  team_head: string;

  @IsArray()
  @IsMongoId({ each: true })
  members: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  projects: string[];
}
