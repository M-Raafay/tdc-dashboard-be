import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
  @InjectModel('Admin') private adminModel : Model<Admin>){}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const {admin_name , password} = (createAdminDto)
    const name= admin_name.toLowerCase()    

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminModel.create({name: name, password:hashedPassword})
    
    return `User ${name} added`;
  }

  async findAll() {
    const admin =  await this.adminModel.find({},'-password')
    return admin;
  }

  async findOneById(id: string) {
    const admin =  await this.adminModel.findById(id)
    return admin;
  }

  async findAdmin(userName : string){
    const adminName = userName.toLowerCase();
    const admin = await this.adminModel.findOne({name:adminName})
    if(!admin){
      throw new NotFoundException('Admin not found : Wrong Name');
    }
    return admin;
  }

  async updateAdminName(id: string, updateAdminDto: UpdateAdminDto) {

    const password = updateAdminDto.password;
    //    const savedPassword = await this.adminModel.findById(id,'-_id -name -__v')
    const data = await this.adminModel.findById(id)
    const savedPassword = data.password

    const isMatch = await bcrypt.compare(password, savedPassword);
    if(isMatch){
      const updateName = this.adminModel.updateOne({_id : id}, {name : updateAdminDto.admin_name.toLowerCase()})
      return updateName;// edit this acknowledgement
    }else{
      throw new Error('wrong password')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }



  
}
