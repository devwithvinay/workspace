import mongoose, { model , Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    username:string,
    email:string,
    password:string
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