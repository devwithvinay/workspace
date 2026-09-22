import mongoose, { model , Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    username:string;
    email:string;
    password:string;

    isVerified: boolean;
    verificationToken?: string;
    tokenExpiry?: Date;
    resetPasswordToken?: string;
    resetTokenExpires: Date ;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      required:true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isVerified:{
      type:Boolean,
      default:false
    },

    verificationToken:{
      type:String,
    },
    tokenExpiry:{
      type:Date
    },
    resetPasswordToken: {
      type:String 
    },

    resetTokenExpires: Date,

  },
  { timestamps: true },
);

userSchema.pre("save",async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password , 10)
  }
  
})

const User = mongoose.model<IUser>("User", userSchema);

export default User;