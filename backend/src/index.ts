import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import type { Request, Response } from "express";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


// db connect 
connectDB();

//routes
app.use("/api/v1/users",userRoutes)

app.listen(port , ()=>{
    console.log(`Server is running on port: ${port}`)
})