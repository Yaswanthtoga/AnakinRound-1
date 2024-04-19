import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';


export const verifyToken = async (req:Request,res:Response,next:NextFunction)=>{
    const { authorization } = req.headers
    const token = authorization?.split(" ")[1];

    try {
        if(!token){ 
            return res.status(401).json({ statusCode:401,data:"Not Authenticated" });
        }

        jwt.verify(token,"mysecret",async (err:VerifyErrors|null,payload:any)=>{
            if(err){
                return res.status(403).json({ statusCode:403,data: "Not enough permissions" });
            }else{
                // @ts-ignore
                req.payload = payload;
                next()
            }
        })

    } catch (error) {
        return res.status(500).json({ statusCode:500,data:"Internal Server Error" });
    }
}
