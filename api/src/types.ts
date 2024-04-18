import { admins, users } from "./db/schema";

export interface RegisterRequestBody {
    name: string;
    email: string;
    role: "admin"|"user";
}

export type NewAdmin = typeof admins.$inferInsert;

export type NewUser = typeof users.$inferInsert;