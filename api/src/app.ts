import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route';

dotenv.config();
process.on('uncaughtException',(error)=>{console.log(error)});

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("common"))
app.use(express.json())

// Routes
app.use("/api/auth",authRoute)

app.listen(process.env.PORT || 5000,()=>{
    console.log("server started at port 8000")
})