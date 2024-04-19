import express from 'express';
import { verifyToken } from '../middlewares/tokenVerification.middleware';
import { addTrain, bookSeat, getTicketDetails, getTrains, scheduleTrain } from '../controllers/reservation.controller';
import { verifyApiKey } from '../middlewares/verifyApiKey.middleware';

const router = express.Router();

// Add New Train
router.post('/add-train',verifyToken,verifyApiKey,addTrain)

// Train Schedule Creation
router.post('/schedule-train',verifyToken,verifyApiKey,scheduleTrain)

// Search Trains
router.get('/get-trains',verifyToken,getTrains)

// Book Seat
router.post('/book-seat',verifyToken,bookSeat)

// Get Ticket Details
router.get('/get-ticket-details',verifyToken,getTicketDetails)

export default router;