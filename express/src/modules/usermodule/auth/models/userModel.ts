import mongoose from "mongoose"
import { I_usermodel } from "./userModel.interface"

const userSchema = new mongoose.Schema<I_usermodel>( {

    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String,default:""},
    fathersname:{ type: String,default:""},
    address: {
      city:  { type: String,default:""},
      state: { type: String,default:""},
      pin:  { type: String,default:""}
    },
    age:{ type: String,default:""},
    dob: { type: String,default:""},
    adharnumber:{ type: String,default:""},
    phone: { type: String, required: true ,unique:true},
    image: { type: String, default: null },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
  
  )
  const userModel=  mongoose.model<I_usermodel>("user",userSchema)

  export default userModel