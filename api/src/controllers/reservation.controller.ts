import { Request, Response } from "express"
import { db } from "../db";
import { schedule, ticket, trains } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { NewSchedule, NewTrain } from "../types";
import { v4 as uuidv4 } from "uuid";

export const addTrain = async (req:Request,res:Response)=>{
    const {trainNumber,totalSeats,trainName} = req?.body;
    if(!trainName || !trainNumber || !totalSeats){
        return res.status(404).json({statusCode:404,data:"Missing required fields"});
    }

    try {
        const user = await db.query.trains.findFirst({ where: eq(trains.trainNumber,trainNumber) });

        if(user){
            return res.status(409).json({statusCode:409,data:"Train already added"});
        }

        const newTrain: NewTrain = {trainNumber,totalSeats,trainName};
        const savedRecord = await db.insert(trains).values(newTrain).returning(
            {trainNumber: trains.trainNumber,name:trains.trainName, capacity: trains.totalSeats}
        );

        return res.status(200).json({statusCode:200,data:savedRecord[0]});
    } catch (error) {
        return res.status(500).json({statusCode:500,data:"Internal service error"});
    }
}

export const scheduleTrain = async (req:Request,res:Response)=>{
    const {source,destination,trainNumber,availableSeats} = req?.body;

    try {
        if(!source || !destination || !trainNumber){
            throw new Error('Please provide all necessary info');
        }
        const validTrain = await db.query.trains.findFirst({where:eq(trainNumber,trains.trainNumber)});
        if(!validTrain)return res.status(404).json({data:"Not a valid trainNumber"});

        const existingDocument = await db.query.schedule.findFirst({where:eq(trainNumber,schedule.trainNumber)});
        if (existingDocument) {
            return res.status(409).json({ message: "Already scheduled" });
        }
        
        const newSchedule:NewSchedule = {source,destination,trainNumber,availableSeats};
        const record = await db.insert(schedule).values(newSchedule).returning({
            trainNumber:schedule.trainNumber,
            source:schedule.source,
            destination:schedule.destination,
            availableSeats:schedule.availableSeats
        });

        return res.status(200).json({statusCode:200,data:record[0]});

    } catch (error) {
        return res.status(404).json({statusCode:404,data:error});
    }
}

export const getTrains = async (req:Request,res:Response)=>{
    const { source,destination } = req?.query;
    if(!source || !destination){
        throw new Error("Please select both source & destination")
    }

    try {
        // @ts-ignore
        const trains = await db.select().from(schedule).where(sql`${source}=${schedule.source} and ${destination}=${schedule.destination}`);
        return res.status(200).json(trains)
    } catch (error) {
        return res.status(404).json({statusCode:404,data:error});
    }
}

export const bookSeat = async (req:Request,res:Response)=>{
    const { trainNumber,numberOfSeats } = req?.body;

    if(!trainNumber && !numberOfSeats)return res.status(404).json({statusCode:404,data:"Please choose the train and number of seats"});
    
    try {
        let result;
        await db.transaction(async (tx)=>{
            try {
                const seats = await tx
                .select()
                .from(schedule)
                .where(eq(schedule.trainNumber,trainNumber))
                .for('update')

                const row = seats[0];

                if (row.availableSeats >= numberOfSeats) {
                    await tx.update(schedule).set({
                        availableSeats: row.availableSeats - numberOfSeats
                    }).where(eq(schedule.trainNumber, trainNumber));
                } else {
                    throw new Error("Not enough Available Seats")
                }

                // @ts-ignore
                result = await db.insert(ticket).values({ PNR: uuidv4(), trainNumber,userId:req?.payload['id'], numberofSeats:numberOfSeats }).returning({PNR:ticket.PNR});
            } catch (error) {
                tx.rollback();
                return res.status(400).json({statusCode:400,data:error})
            }
        });
        return res.status(200).json({statusCode:200,data:{status:"Tickets Booked Succesfully",PNR:result?.[0]?.["PNR"]}});

    } catch (error) {
        return res.status(500).json({statusCode:500,data:error})
    }
}

export const getTicketDetails = async (req:Request,res:Response)=>{
    const { PNR } = req?.query;

    try {
        if(!PNR)throw new Error("Please provide PNR details");

        // @ts-ignore
        const result = await db.query.ticket.findFirst({ where:eq(ticket.PNR,PNR)});
        return res.status(200).json({data:result})

    } catch (error) {
        return res.status(404).json({statusCode:404,data:"Please provide PNR details"})
    }
}
