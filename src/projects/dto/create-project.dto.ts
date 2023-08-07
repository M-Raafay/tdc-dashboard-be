import { IsNotEmpty, IsString } from "class-validator"

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name :string

    @IsString()
    @IsNotEmpty()
    cordinator : string
    
    FE:object[]
    BE:string[]
    UI:string[]
    Deployment: string[]

}
