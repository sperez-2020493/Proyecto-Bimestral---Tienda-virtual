"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.router.js";
import userRouter from "../src/user/user.router.js"
import categoryRouter from "../src/category/category.router.js"
import apiLimiter from "../src/middlewares/rate-limit-validator.js";

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter);
}

const routes = (app) =>{
    app.use("/storeSystem/v1/auth", authRoutes);
    app.use("/storeSystem/v1/user", userRouter);
    app.use("/storeSystem/v1/category", categoryRouter);
}

const conectarDB = async () =>{
    try{
        await dbConnection()
    }catch(err){
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initiServer = () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        routes(app);
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`Server init failed: ${err}`)
    }
}