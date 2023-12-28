import  express  from "express";
import { getAllProducts } from "../controller/productController";
import { verifyToken } from "../../../middlewares/verifyToken";

const productRouter=express()

productRouter.get("/fetchall",verifyToken,getAllProducts)

export default productRouter