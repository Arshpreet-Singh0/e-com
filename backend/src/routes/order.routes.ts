import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createOrder, getOrders } from "../controllers/order.controller";


const router : Router = express.Router();

router.route('/').post(isAuthenticated, createOrder);

router.route('/').get(isAuthenticated, getOrders);

export default router;