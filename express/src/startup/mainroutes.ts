import {Router} from "express"
import { verifyToken } from "../middlewares/verifyToken"
import productRouter from "../modules/productsmodule/routes/productRouter"
import authRouter from "../modules/usermodule/auth/routes/authRouter"
import userRouter from "../modules/usermodule/user/routes/userroutes"

const mainRouter=Router()
mainRouter.use("/auth",authRouter)
mainRouter.use("/user",userRouter)
mainRouter.use("/products",productRouter)

export default mainRouter