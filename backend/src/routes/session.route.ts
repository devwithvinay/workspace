import express from "express"
import { loggedIn } from "../middleware/auth.middleware.js"
import { startSession } from "mongoose"

const router = express.Router()

router.post("/start" , loggedIn, startSession)

export default router