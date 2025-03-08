import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.routes";

const app = express();

const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());

//api's

app.use('/api/v1', userRouter);

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