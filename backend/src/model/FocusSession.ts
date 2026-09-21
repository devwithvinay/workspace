import mongoose from "mongoose"

export interface IFocusSession{
    user: mongoose.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    duration: number
    status: "active"| "completed" | "cancelled"
}

const focusSessionSchema = new mongoose.Schema<IFocusSession>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    startTime:{
        type:Date,
        required:true
    },

    endTime:Date,

    duration:{
        type:Number,
        default: 0 

    },
    status:{
        type:String,
        enum:["active" , "completed" , "cancelled"],
        default:"active"
    }
  },
  { timestamps: true },
);

const FocusSession = mongoose.model<IFocusSession>("FocusSession" , focusSessionSchema)

export default FocusSession;