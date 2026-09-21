import type { Request, Response } from "express"
import User from "../model/User.model.js"

export const registerUser = async function(req:Request, res:Response){
  // get data from body
  const { username, email, password } = req.body;

  
  // user validate
try {
      if (!username || !email || !password) {
        res.status(400).json({
          message: "All fields are required",
        });
      }
      // if this email already exists

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({
          message: "User already exists",
        });
      }

      const user = await User.create({ username, email, password });
      if (!user) {
        res.status(400).json({
          message: "Failed to Register",
        });
      }


    
} catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
}
}