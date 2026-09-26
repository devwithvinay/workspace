import type { Request, Response } from "express";
import FocusSession from "../model/FocusSession.js";

export const startSession = async function (req: Request, res: Response) {
  // user Id auth middleware se aygi
  const userId = req.user?.id;
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
      message: "Failed to start session",
      success: false,
      error,
    });
  }
};

export const completeSession = async function (req: Request, res: Response) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({
        message: "failed to authorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
      });
    }

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "active",
    });
    if (!session) {
      return res.status(400).json({
        message: "Active session not found",
      });
    }

    //current time
    const endTime = new Date();

    // duration on seconds
    const duration = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000,
    );
    session.endTime = endTime;
    session.duration = duration;
    session.status = "completed";

    await session.save();

    return res.status(200).json({
      message: "Focus session completed",
      success: true,
      session,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to complete session",
      success: false,
      error,
    });
  }
};

export const cancelSession = async function (req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }
    if (!sessionId) {
      return res.status(400).json({
        message: "Session is required",
        success: false,
      });
    }
    const cancelSession =await FocusSession.findOne({
      _id:sessionId,
      user: userId,
      status:"active"

    })

    if(!cancelSession){
      return res.status(400).json({
        message:"Active session is not found"
      })
    }

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - cancelSession.startTime.getTime())/1000,)

    cancelSession.endTime = endTime
    cancelSession.duration = duration
    cancelSession.status = "cancelled"

    await cancelSession.save();

  } catch (error) {}
};

const getSession = async function (req: Request, res: Response) {};
