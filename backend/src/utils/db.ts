import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()


const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI){
    throw new Error("Please provide MONGO_URL in env ");
}

const connectDB = ()=>{
      mongoose.connect(MONGO_URI)
     .then(()=>{
        console.log("MongoDb connected Succesfully")
     })
     .catch((err)=>{
        console.log("Failed to connect MongoDB",err)
     })
}

export default connectDB