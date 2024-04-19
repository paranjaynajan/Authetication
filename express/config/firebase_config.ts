import dotenv from "dotenv";
dotenv.config();
export const firebaseConfig = {
  apiKey: process.env.APIKEYFIREBASE,
  authDomain:process.env.AUTHDOMAINFIREBASE,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};




