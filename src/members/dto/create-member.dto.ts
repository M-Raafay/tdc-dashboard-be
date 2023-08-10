import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProjectDto } from "src/projects/dto/create-project.dto";
import { Project } from "src/projects/schema/projects.schema";

export class CreateMemberDto {
    _id: string

    @IsString()
    @IsNotEmpty()
    member_id :string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username :string

    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsString()
    tech_stack: string;

    @IsString()
    team_lead: string;

    @IsString()
    projects : string[]
}
