import mongoose, { MongooseError } from "mongoose";

export class DatabaseMongo{
    url: string ;

    constructor(url: string ){
    this.url=url;
    }

    async connectMongo(){
        try{
             await mongoose.connect(this.url)
            console.log(`Connected to database: ${mongoose.connection.db.databaseName}`)
        }catch(error){
            if(error instanceof MongooseError){
                throw(error.message)
            }
            throw(error)
        }
    }

    async disconnectMongo() {
        try {
          await mongoose.disconnect();
          console.log(
            `Disconnected from database: ${mongoose.connection.db.databaseName}`
          );
        } catch (error) {
          throw error;
        }
      }
}