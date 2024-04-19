import { db } from '../db';
import { eq } from 'drizzle-orm';
import { admins } from '../db/schema';
import { NextFunction, Request, Response } from 'express';


export const verifyApiKey = async (req:Request,res:Response,next:NextFunction)=>{

    // @ts-ignore
    const payload = req?.payload
    try {
        if(payload?.role === "admin"){
            const apiKey = req.headers['x-admin-apikey'];
            const admin = await db.query.admins.findFirst({where:eq(admins.userId,payload?.id)});

            if(!apiKey || admin?.apiKey!==apiKey){
                return res.status(403).json({ statusCode:403,data: "Not enough permissions" });
            }
            next()
        }else{
            return res.status(403).json({ statusCode:403,data: "Not enough permissions" });
        }
    } catch (error) {
        return res.status(500).json({statusCode:500,data:"Internal Server Error"});
    }
    
}