import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schema/members.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectsService } from 'src/projects/projects.service';
import { SignUpDto } from './dto/signup-member.dto';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class MembersService {

  constructor(@InjectModel('Member') private memberModel: Model<Member>, 
   private readonly projectService: ProjectsService) {};

    // signup for member only
  async signup(signupDto: SignUpDto) { 
    const {password ,email, ...restData} = (signupDto)
    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
      throw new NotAcceptableException('error in password')
    }
    const emailLowercase= email.toLowerCase()
    try {
      const data=  await this.memberModel.create({ email: emailLowercase,password:hashedPassword, ...restData})
      
      const receivedData = data.toObject();
      
      const {password ,...userdata} = receivedData
      return userdata

    } catch (error) {
      throw new Error("error occurred while interacting with the database.");
     }
  }

  // used in auth
  async findMember(email : string){
    const memberEmail = email.toLowerCase();
    const member = await this.memberModel.findOne({email:memberEmail})
    return member;
  }

  //this is for creating member for admin
  async createMember(createMemberDto: CreateMemberDto) { 

    const { email, ...restData} = (createMemberDto)
    // const hashedPassword = await bcrypt.hash(password, 10);
    // if(!hashedPassword){
    //   throw new NotAcceptableException('error in password')
    // }
    const emailLowercase= email.toLowerCase()
    try {
      const data=  await this.memberModel.create({ email: emailLowercase, ...restData})
      const receivedData = data.toObject();
      
      const {password ,...memberData} = receivedData
      return memberData
      
    } catch(error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Duplicate email error: The resource already exists.', error.message);
      }
      throw new NotAcceptableException(`error occurred.  ${error.message}`);
     }
  }

  async findAll(req) {
    const user= req.user
    const {role} = req.user // use this to achieve user.role add try catch
   
    if(role === 'admin'||role === 'super'){
      return await this.memberModel.find({},'-password').populate('projects');
    }else{
        return await this.memberModel.find({},'-password').populate('projects', { coordinator : 0 , client:0 , cost : 0});
      }

  }

  async findOneById(id: string) {
    try{
      const memberData = await this.memberModel.findById({_id : id}, '-password').populate('projects');
      if(!memberData){
        throw new NotFoundException('Member not found OR doesnot exists : Wrong ID');
      } 
        return memberData;
    }catch(error){
      throw new NotAcceptableException(`error occurred while interacting with the database. ${error}`);
    }
  }

  async update(id: string, updateMemberDto: UpdateMemberDto):Promise<Member> { 
   let {projects , ...updateData} = updateMemberDto
   console.log(updateData);
   
   try{
    const data =await this.memberModel.findByIdAndUpdate(id, {$set : updateData,$push : {projects}} ,{new:true})
    // const receivedData = data.toObject();
      
    // const {password ,...restdata} = receivedData
    // console.log(password,'#####', restdata);
    
    return data;
   }catch(error){
    throw new Error(error.message)
   }
  }

  async remove(id: string) {
    try{
      const member = await this.memberModel.findByIdAndDelete({_id :id})
      if(!member){
        throw new NotFoundException('Member not found OR doesnot exists : Wrong ID');
      }
      return 'Member Deleted ';
    }catch(error){
      throw new Error(`error occurred while interacting with the database. ${error}`);
    }
  }

}
