import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";

const app = express();

const PORT = process.env.PORT || 8080;

//cors
app.use(cors({
    origin : process.env.ALLOWED_CLIENTS?.split(",").map((origin)=> origin.trim()) || ["http://localhost:3000"],
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}));

//middlewares
app.use(express.json());
app.use(cookieParser());

//api's

app.use('/api/v1', userRouter);
app.use('/api/v1/product', productRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
  });

app.listen(PORT, ()=>{
    console.log(`App Listening to port ${PORT}`);
});