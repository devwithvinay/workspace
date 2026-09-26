import express from "express"
import { loggedIn } from "../middleware/auth.middleware.js"
import { cancelSession, completeSession, getSession, startSession } from "../controllers/session.controller.js"

const router = express.Router()

router.post("/start", loggedIn, startSession);
router.post("/:sessionId/complete", completeSession);
router.patch("/:session/cancel" , cancelSession)
//patch existing resource ko partially update karna
router.get("/",loggedIn,getSession)


export default router;