import express, { Application, Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainRouter from "./mainroutes/mainrouter";
import { DatabaseMongo } from "./config/mongo_config";
import { job, logger } from "./utils/server_services";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import cookieParser from "cookie-parser";
import path from "path";
import { options } from "joi";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 

})



export function runServer() {
  try {
    const corsOptions={
        origin: ["http://localhost:3000","http://localhost:4200",],
        credentials: true,
      }
    dotenv.config();
    const app: Application = express();
    const port = process.env.PORT;

    // Apply the rate limiting middleware to all requests.
    app.use(limiter)

    // helemt protection 
    app.use(
      helmet({
        contentSecurityPolicy: false, // Disable Content Security Policy also for js script
        xDownloadOptions: false, // Disable X-Download-Options header
      })
    );

    //for cors
    app.use(cors(corsOptions));
    
    app.use('/uploads',express.static(path.join(process.cwd(),'/uploads')));
  

    if (!process.env.MONGODB_URI) {
        throw Error("MONGODB_URI environment variable is not defined.");
       
    }
    const db = new DatabaseMongo(process.env.MONGODB_URI)
    
    //start cronjob for every day 2am clock
    job.start()

    //to tell express that it will receive json in body
    app.use(express.json());



    //for cookies
    app.use(cookieParser());

    //to tell express that it will recive formdata in body
    //app.use(express.urlencoded({ extended: true }));
     
    //database connection
     db.connectMongo().catch(err => {
       logger.error(err);
        console.log(err);
     });
     

    //server connection status
    app.get("/server-status", (req, res) => {
        res.status(200).json({ message: "Server is up and running!" });
      });
      

    //main route
    app.use("/api", mainRouter);


    app.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });

  } catch (err) {
    logger.error(err);
    console.log(err,"asdsd");
  }
}
runServer();
