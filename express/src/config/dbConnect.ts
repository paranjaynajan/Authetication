import mongoose, { MongooseError } from "mongoose";

const dataBaseConnection = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.DB_URL}`);
        console.log("connection is established")
    
    }
    catch (error: unknown) {
        if(error instanceof MongooseError){
            console.log(error.message)
        }
        console.log(error)
    }
}


export default dataBaseConnection