import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { Project } from 'src/projects/schema/projects.schema';

export class UpdateMemberDto {

    // @IsString()
    // member_id :string

    @IsString()
    @MinLength(3)
    username :string

    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsString()
    tech_stack: string;

    @IsString()
    team_lead: string;

    @IsNumber()
    expense: number;

    @IsMongoId({ each: true }) 
    projects : string[]
}
