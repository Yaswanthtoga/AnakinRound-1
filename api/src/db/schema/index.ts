import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum("role",["admin","user"]);

export const users = pgTable('users',{
    id: serial('id').primaryKey(),
    name: varchar('name',{ length:256 }).notNull(),
    email: varchar('email',{ length:256 }).notNull(),
    role: roleEnum("role").notNull(),
},(users)=>{
    return {
        emailIndex: uniqueIndex('email_idx').on(users.email),
    }
});

export const userAdminRelations = relations(users,({one})=>({
    admin: one(admins,{
        fields:[users.id],
        references: [admins.userId]
    })
}))

export const admins = pgTable('admins',{
    id: serial('id').primaryKey(),
    userId: integer("userId").notNull().references(()=>users.id,{onDelete:'cascade'}),
    apiKey: varchar("apiKey", { length:256 }).notNull() 
})