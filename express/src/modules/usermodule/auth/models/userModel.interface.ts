import mongoose, { ObjectId } from "mongoose";

export interface I_usermodel {

  email: string;
  password: string;
  name: string;
  lastname: string;
  fathersname:string;
  address: string;
  city: string;
  state:string;
  pin:string;
  age:string;
  dob: Date;
  adharnumber:string;
  phone: string;
  image?: null;
  role: string;
  createdAt: string;
  updatedAt: string;
  isUpdated: boolean;
}
export interface I_userUpdateData extends I_usermodel {
  _id?:mongoose.Types.ObjectId;
}