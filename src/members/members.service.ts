import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schema/members.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectsService } from 'src/projects/projects.service';
import { SignUpDto } from './dto/signup-member.dto';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { NotFoundError } from 'rxjs';

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
      throw new HttpException('Failed to signup', HttpStatus.INTERNAL_SERVER_ERROR,error.message);
     }
  }

  // used in auth
  async findMember(email : string){
    const memberEmail = email.toLowerCase();
    const member = await this.memberModel.findOne({email:memberEmail})
    return member;
  }


  async resetMemberPassword(id:string, passwordData:object){
    const oldData = await this.memberModel.findById(id)
    const previousPassword= oldData.password
    const isMatch = await bcrypt.compare(passwordData['old_password'], previousPassword);
    if(!isMatch){
      throw new NotAcceptableException('oldpassword doesnot match')   
    }
    
    const hashedPassword = await bcrypt.hash(passwordData['new_password'], 10);
    if(!hashedPassword){
      throw new InternalServerErrorException('error in password')
    }
    try{
      const member = await this.memberModel.findByIdAndUpdate({_id:id}, {password : hashedPassword},{new : true})
    
      if(!member){
      throw new InternalServerErrorException('error in updating password');
    } 

    return member;
  }catch(error){
    throw new HttpException('couldnot reset password', HttpStatus.INTERNAL_SERVER_ERROR, error.message)
  }

  }


  async findByIdAndUpdatePassword(id:string, new_password:string){
    const data = await this.memberModel.findById(id)
    console.log(data);
    if(!data){
      throw new NotFoundException('admin not found')
    }

    const updatePassword = await this.memberModel.findByIdAndUpdate({_id : id}, {password :new_password},{new:true})
    if(!updatePassword){
      throw new NotFoundException('admin not found : password not updated')
    }

    return updatePassword

  }

  //this is for creating member for admin
  async createMember(createMemberDto: CreateMemberDto) { 

    const { email, ...restData} = (createMemberDto)
    const hashedPassword = await bcrypt.hash("12345", 10);
    if(!hashedPassword){
      throw new InternalServerErrorException('error in password')
    }
    const emailLowercase= email.toLowerCase()

    try {
      const data=  await this.memberModel.create({ email: emailLowercase,password:hashedPassword, ...restData})
      if(!data){
        throw new HttpException('user not created',HttpStatus.CONFLICT);
      } 
      
      const receivedData = data.toObject();
      
      const {password ,...memberData} = receivedData
      return memberData
      
    } catch(error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Duplicate email error: The resource already exists.', error.message);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Failed to create member', HttpStatus.INTERNAL_SERVER_ERROR, error.message);     
    }
  }

  async findAll(req) {
    const user= req.user
    const {role} = req.user // use this to achieve user.role add try catch
   
    if(role === 'admin'||role === 'super'){
      return await this.memberModel.find({},'-password').populate('projects');
    }else{
        return await this.memberModel.find({},'-password').populate('projects', { coordinator : 0 ,platform:0, client:0 ,consultant:0, cost : 0, start_date:0, end_date:0, createdAt:0}); // adjust fields
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
      throw new HttpException('Failed to create member', HttpStatus.INTERNAL_SERVER_ERROR, error.message)
      //throw new NotAcceptableException(`error occurred while interacting with the database. ${error}`);
    }
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) { 
    const user = await this.memberModel.findById(id)
    if(!user){
      throw new HttpException('Member not found OR doesnot exists : Wrong ID', HttpStatus.NOT_FOUND);
    } 

   try{

    //const data =await this.memberModel.findByIdAndUpdate(id, {$set : updateData,$push : {projects}} ,{new:true})
    const data =await this.memberModel.findByIdAndUpdate(id, {$set :updateMemberDto},{new:true})
    const receivedData = data.toObject();
      
    const {password ,...restdata} = receivedData
//    console.log(password,'#####', restdata);

    // if(data===null){
    //   console.log('dcs');
      
    //   throw new HttpException('Member not found OR doesnot exists : Wrong ID', HttpStatus.NOT_FOUND);
    // } 

    // console.log(data);
    return restdata;
   }catch(error){
    throw new HttpException('Failed to update', HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }

  async remove(id: string) {
    try{
      const member = await this.memberModel.findByIdAndDelete({_id :id})
      if(!member){
        throw new NotFoundException('Member not found OR doesnot exists : Wrong ID');
      }
      return {message:'Member Deleted '};
    }catch(error){
      throw new HttpException('Failed to delete', HttpStatus.INTERNAL_SERVER_ERROR,error.message);
    }
  }

}
