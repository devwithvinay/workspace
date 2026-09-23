import type {Request , Response} from "express"
import User from "../model/User.model.js"


const startSession = async function(req:Request , res:Response){

    const userId = req.user?.id

}

const completeSession = async function(req:Request , res:Response){

}

const cancelSession = async function (req:Request , res: Response){

}

const getSession = async function (req:Request , res: Response){

}