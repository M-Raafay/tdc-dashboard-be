import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
    _id : string
    
    member_id :string

    username :string

    first_name: string;

    last_name: string;

    email: string;

    TS: string;

    TL: string;
}
