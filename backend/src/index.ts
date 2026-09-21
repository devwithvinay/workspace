import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import type { Request, Response } from "express";
import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/",(req:Request , res:Response)=>{
    res.send(200).json({
        message:" Api is set now"
    })

})

// db connect 
connectDB()

app.listen(port , ()=>{
    console.log(`Server is running on port: ${port}`)
})