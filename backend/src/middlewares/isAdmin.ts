import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const isAdmin = async(req:Request , res:Response, next:NextFunction)=>{
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        });
        if(!user || user.role !== "admin"){
            res.status(401).json({
                message : "You are not authenticated",
                success : false
            })
            return;
        }
        next();

    } catch (error) {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}