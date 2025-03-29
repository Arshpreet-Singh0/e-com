import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createOrder } from "../controllers/order.controller";


const router : Router = express.Router();

router.route('/').post(isAuthenticated, createOrder);

export default router;