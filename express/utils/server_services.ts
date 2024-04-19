import { CronJob } from "cron";
import { LogEntry } from "winston";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { firebaseConfig } from "../config/firebase_config";
import { randomBytes } from "crypto";
const winston = require('winston');
import * as path from 'path';
const errorFormat = winston.format((info: { message: string; name: any; }, opts: any) => {
    if (info instanceof Error) {
      info.message = `${info.name}: ${info.message}`;
    }
  
    return info;
  });
  
  export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      errorFormat(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }:LogEntry) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({  filename: path.join(__dirname, '../loggers/error.log'), level: 'error' }),
      new winston.transports.File({  filename: path.join(__dirname, '../loggers/combined.log') }),
    ],
  });
  
  const sendBackup = async() =>{
     // Initialize Firebase
     const appForFireBase = initializeApp(firebaseConfig);

     const storage = getStorage(appForFireBase);

     const errorContent = fs.readFileSync('../loggers/error.log', 'utf-8');

     const storageRef = ref(storage, '../loggers/error.log');
    
     await uploadString(storageRef, errorContent);

  }

  //for every 2 am
  export const job = CronJob.from({
      cronTime: '0 2 * * *',
      onTick: function () {
      sendBackup()
      },
      start: true,
      timeZone: 'Asia/Kolkata'
  });

  export const  generateOTP=(): string=> {
    const buffer = randomBytes(2);
    const hex = buffer.toString("hex");
    const number = parseInt(hex, 16);
    const otp = number % 10000;
    const paddedOTP = otp.toString().padStart(4, "0");
  
    return paddedOTP;
  }