import express, { Application } from "express";
import dotenv from "dotenv";
import mainRouter from "./startup/mainroutes";
import dataBaseConnection from "./config/dbConnect";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const corsOptions={
  origin: ["http://localhost:3000","http://localhost:4200",],
  credentials: true,
}
dotenv.config();
const app: Application = express();
app.use(cookieParser());
dataBaseConnection();
app.use(express.json());
app.use(cors(corsOptions));


app.use(express.static(path.join(__dirname, '../uploads')));
app.use("/api", mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
