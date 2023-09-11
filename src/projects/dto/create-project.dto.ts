import { IsDate, IsEnum, IsISO8601, IsNotEmpty, IsString } from "class-validator"
import { Status } from "../schema/projects.schema"

export class CreateProjectDto {
    _id : string

    @IsString()
    @IsNotEmpty()
    name :string

    @IsString()
    @IsNotEmpty()
    stack :string

    @IsString()
    @IsNotEmpty()
    team_lead : string

    @IsString()
    @IsNotEmpty()
    duration :string

    @IsString()
    @IsNotEmpty()
    coordinator :string

    @IsString()
    @IsNotEmpty()
    platform :string

    @IsString()
    @IsNotEmpty()
    client :string

    @IsString()
    @IsNotEmpty()
    consultant :string

    @IsEnum(Status)
    status: Status;

    @IsISO8601()
    @IsNotEmpty()
    start_date :Date

    @IsISO8601()
    @IsNotEmpty()
    end_date :Date
    
    @IsString()
    @IsNotEmpty()
    cost :string

}
