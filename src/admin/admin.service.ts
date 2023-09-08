import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private adminModel : Model<Admin>){}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const {password ,email, ...restData} = (createAdminDto)

    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
      throw new NotAcceptableException('error in hashing password')
    }
    const emailAdmin= email.toLowerCase() 
    try{
      const data=  await this.adminModel.create({email: emailAdmin, password:hashedPassword, ...restData})
      const receivedData = data.toObject();
      
      const {password ,...adminData} = receivedData
      return adminData

    }catch(error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException('Duplicate email error: The resource already exists.', error.message);
      }
      throw new NotAcceptableException(`error occurred.  ${error.message}`);
    }    
  }

  async findAll() {
    try{
      const adminData =  await this.adminModel.find({_id:{$ne:'64e88b6a96bb981675894a94'}}, '-password')
      // make it dynamic....token check extract id and place in $ne
//      find({_id: { $ne: '64f032a70dad1b907f496e29' }},'-password')
      return adminData;

    }catch(error){
      throw new Error(`error occurred while interacting with the database. ${error}`);
    }
  }

  async findOneById(id: string) {
    try{
    const admin =  await this.adminModel.findById(id, '-password')
    if(!admin){
      throw new NotFoundException('Admin not found OR doesnot exists : Wrong ID');
    }
    return admin;
  }catch(error){
      throw new Error(`error occurred while interacting with the database. ${error}`);
    }
  }

  // used in reset password
  async resetAdminPassword(id:string, passwordData:object){

    const oldData = await this.adminModel.findById(id)
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
      const admin = await this.adminModel.findByIdAndUpdate({_id:id}, {password : hashedPassword},{new : true})
    
      if(!admin){
      throw new InternalServerErrorException('error in updating password');
    } 

    return admin;
  }catch(error){
    throw new HttpException('couldnot reset password', HttpStatus.INTERNAL_SERVER_ERROR, error.message)
  }

  }

  // used in auth
  async findAdmin(userName : string){
    const adminName = userName.toLowerCase();    
    const admin = await this.adminModel.findOne({username:adminName})
    // if(!admin){
    //   console.log('s');
      
    //   throw new NotFoundException('Admin not found : Wrong Name');
    // }
    return admin;
  }

  // used in auth. should be done by id
  async findAdminByMail(mail : string){
    const adminMail = mail.toLowerCase();    
    const admin = await this.adminModel.findOne({email:adminMail})
    //console.log(admin);
    
    // if(!admin){
    //   console.log('s');
      
    //   throw new NotFoundException('Admin not found : Wrong mail');
    // }
    return admin;
  }

  async findByIdAndUpdatePassword(id:string, new_password:string){
    const data = await this.adminModel.findById(id)
    console.log(data);
    if(!data){
      throw new NotFoundException('admin not found')
    }

    const updatePassword = await this.adminModel.findByIdAndUpdate({_id : id}, {password :new_password},{new:true})
    if(!updatePassword){
      throw new NotFoundException('admin not found : password not updated')
    }

    return updatePassword

  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {

    const {password, email, ...restData} = updateAdminDto;
    //    const savedPassword = await this.adminModel.findById(id,'-_id -name -__v')
    const adminMail= email.toLowerCase() // see if my usecase changes
    const data = await this.adminModel.findById(id)
    const savedPassword = data.password

    const isMatch = await bcrypt.compare(password, savedPassword);
    if(isMatch){
        const updatedRecord = this.adminModel.findByIdAndUpdate({_id : id}, {email :adminMail, ...restData},{new:true})
        //const {password, ...adminData} = updatedRecord 
        return updatedRecord
    }else{
      throw new NotAcceptableException('wrong password')
    }
  }

  async remove(id: string) {
    try{
      const admin =  await this.adminModel.findByIdAndDelete(id)
      if(!admin){
        throw new NotFoundException('Admin not found OR doesnot exists : Wrong ID');
      }
      return `Admin ${admin.admin_name} deleted`;
    }catch(error){
      throw new Error(`error occurred while interacting with the database. ${error}`);
    }
  }


  // const result =  await this.adminModel.findByIdAndDelete(id)
  // return `Admin ${result.username} deleted`;

  
}
