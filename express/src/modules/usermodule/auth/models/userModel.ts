import mongoose, { Mongoose, UpdateQuery } from "mongoose"
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
    dob: { type: mongoose.SchemaTypes.Date},
    adharnumber:{ type: String,default:"" ,
      validate: {
        validator: function(value:string):boolean {
          console.log(value,'vall');
          if(value.length){
            return false;
          }
          return true
        },
        message: props => 'Cannot update aadhar card'
      },
    },
    phone: { type: String, required: true ,unique:true},
    image: { type: String, default: null },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
  
  )
  userSchema.pre('findOneAndUpdate', 
  
  
  async function (next) {
    const update = this.getUpdate() as UpdateQuery<any>;
    console.log(update, "update")
    if (update && update.adharnumber) {
      throw new Error("Cannot modify adharnumber after the first update");
    }
    if (update && update.dob) {
      throw new Error("Cannot modify date of birth after the first update");
    }
  next();
});




  const userModel=  mongoose.model<I_usermodel>("user",userSchema)

  export default userModel