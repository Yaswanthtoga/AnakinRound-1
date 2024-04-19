import { Request } from "express";
import { admins, schedule, trains, users } from "./db/schema";

export interface RegisterRequestBody {
    name: string;
    email: string;
    role: "admin"|"user";
}

export interface JwtPayload {
    id: number,
    name: string,
    email: string,
    role: string,
    iat: number,
    exp: number
}

export type NewAdmin = typeof admins.$inferInsert;

export type NewUser = typeof users.$inferInsert;

export type NewSchedule = typeof schedule.$inferInsert;

export type NewTrain = typeof trains.$inferInsert;