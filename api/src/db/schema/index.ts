import { relations } from 'drizzle-orm';
import { bigint, index, integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';


// User Service
export const roleEnum = pgEnum("role",["admin","user"]);

export const users = pgTable('users',{
    id: serial('id').primaryKey(),
    name: varchar('name',{ length:256 }).notNull(),
    email: varchar('email',{ length:256 }).notNull().unique(),
    role: roleEnum("role").notNull(),
});

export const userRelations = relations(users,({one,many})=>({
    admin: one(admins,{
        fields:[users.id],
        references: [admins.userId]
    }),
    tickets: many(ticket)
}));

export const admins = pgTable('admins',{
    id: serial('id').primaryKey(),
    userId: integer("userId").notNull().references(()=>users.id,{onDelete:'cascade'}),
    apiKey: varchar("apiKey", { length:256 }).notNull()
});


// Train & Reservation Service
export const trains = pgTable('trains',{
    trainNumber: integer('trainNumber').primaryKey(),
    trainName: varchar('trainName').unique().notNull(),
    totalSeats: integer('capacity').default(0)
});

export const trainRelations = relations(trains,({one,many})=>({
    schedules: one(schedule,{
        fields:[trains.trainNumber],
        references: [schedule.trainNumber]
    }),
    tickets: many(ticket)
}));

export const schedule = pgTable('schedule',{
    id: serial('id').primaryKey(),
    trainNumber: integer('trainNumber').notNull().references(()=>trains.trainNumber,{onDelete:'cascade'}),
    source: varchar('source',{ length:256 }).notNull(),
    destination: varchar('destination',{ length:256 }).notNull(),
    availableSeats: integer('availableSeats').notNull()
},(schedule)=>{
    return {
        scheduleIdx: index('scheduleIdx').on(schedule.source,schedule.destination),
        trainNumberIdx: index('trainnum_idx').on(schedule.trainNumber)
    }
});


export const ticket = pgTable('ticket',{
    PNR: varchar('PNR',{length:256}).primaryKey(),
    trainNumber: integer('trainNumber').notNull().references(()=>trains.trainNumber,{onDelete:'cascade'}),
    userId: integer("userId").notNull().references(()=>users.id,{onDelete:'cascade'}),
    numberofSeats: integer('seats').notNull()
});

export const ticketRelations = relations(ticket,({one})=>({
    passenger: one(users,{
        fields:[ticket.userId],
        references: [users.id]
    }),
    train: one(trains,{
        fields:[ticket.trainNumber],
        references: [trains.trainNumber]
    }),
}))


