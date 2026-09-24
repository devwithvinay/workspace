import express from "express"
import { loggedIn } from "../middleware/auth.middleware.js"
import { completeSession, startSession } from "../controllers/session.controller.js"

const router = express.Router()

router.post("/start", loggedIn, startSession);
router.post("/:sessionId/complete", completeSession);


export default router;