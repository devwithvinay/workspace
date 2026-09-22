import express from "express";
import { forgotPassword, getUser, loginUser, logout, registerUser, resetpassword, verifyUser } from "../controllers/auth.controller.js";
import { loggedIn } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register" , registerUser)
router.get("/verify/:token",verifyUser)
router.post("/login", loginUser);
router.get("/getme",loggedIn,getUser);
router.get("/logout" , logout)
router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword/:resetToken", resetpassword);





export default router;