import type { Request, Response } from "express";
import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken"

export const registerUser = async function (req: Request, res: Response) {
  // get data from body
  const { username, email, password } = req.body;

  // user validate
  try {
    if (!username || !email || !password) {
     return res.status(400).json({
       message: "All fields are required",
     });
    }
    // if this email already exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {
     return res.status(400).json({
       message: "User already exists",
     });
    }

    const user = await User.create({ username, email, password });
    if (!user) {
     return res.status(400).json({
       message: "Failed to Register",
     });
    }

    // create verification token

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    

    //store token
    user.verificationToken = token;

    //save it in user
    await user.save();

    // generate email

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: 587,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL, // sender address
      to: user.email, // list of recipients
      subject: "Please verify your email", // subject line
      text: `Click on the following link for verification : 
      ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
    };

    //send the mail
    await transporter.sendMail(mailOption)

    // success
    res.status(200).json({
      message:"User Registered Succesfully",
      success:true
    })


  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyUser = async function (req:Request , res:Response) {

  //get token from param to verify with database
  const {token} = req.params

   try {
     if (!token) {
       return res.status(400).json({
         message: "Invalid token",
       });
     }

     const user = await User.findOne({
       verificationToken: token,
     });

     if (!user) {
       return res.status(400).json({
         message: "Invalid or expired token",
       });
     }

     // if it is real token then

     user.isVerified = true;
    // token become undefined
     user.verificationToken = "";
     //expired the token

     user.tokenExpiry = new Date(0);

     await user.save();

     return res.status(200).json({
       message: "User Verification Successfully",
       success: true,
     });
   } catch (error) {
    
    return res.status(500).json({
      message:"Failed to verify User",
      success:false,
      error
    })
   }
  
}

export const loginUser = async function(req:Request , res: Response){

  const {email , password} = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }
    // verify email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if(!user.isVerified){
      return res.status(400).json({
        message: "Verify your email first",
      });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // jwt

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("please provide jwt secret in env");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: email,
      },
      // secret key
      JWT_SECRET,

      { expiresIn: "24h" },
    );
   const cookieOption = {
    httpOnly: true,
    secure: true,
    maxAge:24*60*60*1000
   }

    res.cookie("token" , token , cookieOption)

    res.status(200).json({
      message:"Login Successfully",
      success:true
    })

  } catch (error) {
    return res.status(500).json({
      message:"Failed to login"
    })
    
  }


}

