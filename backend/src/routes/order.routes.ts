import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createOrder, verifyPayment } from "../controllers/order.controller";


const router : Router = express.Router();

router.route('/').post(isAuthenticated, createOrder);

router.route('/verify').post(isAuthenticated, verifyPayment);


export default router;