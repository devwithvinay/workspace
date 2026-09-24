import type {Request , Response} from "express"
import User from "../model/User.model.js"
import FocusSession from "../model/FocusSession.js"


const startSession = async function(req:Request , res:Response){

    // user Id auth middleware se aygi
    const userId = req.user?.id
try {
    
    if (!userId) {
      return res.status(400).json({
        message: "UnAuthorized",
      });
    }

    // Check user already is in active session

    const activeSession = await FocusSession.findOne({
      user: userId,
      status: "active",
    });

    if (activeSession) {
      return res.status(400).json({
        message: "User already in session",
      });
    }
     // create a new focus session
    const session = await FocusSession.create({
      user: userId,
      startTime: new Date(),
      duration: 0,
      status: "active",
    });

    return res.status(200).json({
      message: "Focus session started",
      success: true,
    });
    
} catch (error) {
    return res.status(500).json({
        message:"Failed to start session",
        success:false,
        error
    })   
}
}

const completeSession = async function(req:Request , res:Response){

}

const cancelSession = async function (req:Request , res: Response){

}

const getSession = async function (req:Request , res: Response){

}