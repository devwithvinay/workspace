import jwt from "jsonwebtoken"
import type {NextFunction, Request, Response} from "express"

interface JwtPayload {
  id: string;
  email: string;
}


export const loggedIn = async function(req:Request , res:Response , next:NextFunction){
    console.log(req.cookies)

  try {
        const token = req.cookies?.token;
        //           cookie ko retieve krta h token se 
        //jo token name se cookie store h usko fir ek token var m store kro

        if (!token) {
          return res.status(400).json({
            message: "Invalid token ",
          });
        }
    
        
        const JWT_SECRET=  process.env.JWT_SECRET
        if (!JWT_SECRET){
            throw new Error("Please provide JWT_SECRET in env");
        }

         const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
         req.user = decoded;

         next();
    
  } catch (error) {
    return res.status(500).json({
        message:"Failed to Authentication",
        success:false,
        error
    })
    
  }
}