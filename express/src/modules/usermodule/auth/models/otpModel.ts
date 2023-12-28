import mongoose from "mongoose"
import { I_otpModel } from "./otpModel.interface"


const otpSchema = new mongoose.Schema<I_otpModel>( {
   otp:{type:String,required:true,unique:true},
   userId:{type:String,required:true,unique:true},
   role:{type:String,required:true}
  },
  { timestamps: true }
  
  )
  const otpModel=  mongoose.model<I_otpModel>("otp",otpSchema)

  export default otpModel