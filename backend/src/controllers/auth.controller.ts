import type { Request, Response } from "express";
import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const registerUser = async function (req: Request, res: Response) {
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

    // create verification token

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    if (!token) {
      res.status(400).json({
        message: "Failed to generate token",
      });
    }

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



  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyUser = async function (req:Request , res:Response) {
  
}