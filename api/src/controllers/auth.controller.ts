import express,{Request, Response} from 'express';
import { db } from '../db';
import { users,admins } from '../db/schema'
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { NewAdmin, NewUser, RegisterRequestBody } from '../types';
import { v4 as uuidv4 } from 'uuid';


export const register = async (req:Request,res:Response)=>{

    const { name,email,role }:RegisterRequestBody = req.body;
    try {
        if (!name || !email || !role) {
            return res.status(400).json({ statusCode:400,data: "Missing required fields" });
        }
        const user = await db.query.users.findFirst({ where: eq(users.email,email) });

        if(user){
            return res.status(409).json({statusCode:409,data:"Email-id already taken"});
        }

        const newUser: NewUser = { name,email,role };
        const savedUser = await db.insert(users).values(newUser).returning(
            {id: users.id,name:users.name,email:users.email}
        );
        
        // if admin user
        if(role==="admin"){
            const rec: NewAdmin = { userId:savedUser[0]['id'],apiKey:uuidv4() };
            await db.insert(admins).values(rec);
            return res.status(200).json({statusCode:200,data:{...savedUser[0],"apiKey":rec.apiKey}});
        }

        return res.status(200).json({statusCode:200,data:savedUser[0]});

    } catch (error) {
        return res.status(500).json({statusCode:500,data:"Internal Server Error"});
    }
}

export const login = async (req:Request,res:Response)=>{
    
    const { email }:{email:string} = req.body;
    //{ Email OTP verification implementation }

    try {
        const user = await db.query.users.findFirst({ where:eq(users.email,email) });
        if(!user){
            return res.status(404).json({statusCode:404,data:"No user with this info"});
        }

        // Generate Token
        const payload = user;
        const token = jwt.sign(payload,"mysecret");

        return res.status(200).json({statusCode:200,data:{accessToken:token}});

    } catch (error) {
        res.status(500).json("Server Failed");
    }
    


}