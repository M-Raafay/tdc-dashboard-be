import mongoose from "mongoose";

export interface jwtUser  {
    _id:string
    role:string
}

export interface User {
  _id: mongoose.Types.ObjectId;
  role: string;
}