import mongoose from "mongoose"
import { I_refreshTokenModel } from "./refreshTokenModel.interface"


const refreshSchema = new mongoose.Schema<I_refreshTokenModel>( {
   refreshToken:{type:String,required:true,unique:true},
   userId:{type:String,required:true,unique:true},
   role:{type:String,required:true}
  },
  { timestamps: true }
  
  )
  const refreshTokenModel=  mongoose.model<I_refreshTokenModel>("refreshtoken",refreshSchema)

  export default refreshTokenModel