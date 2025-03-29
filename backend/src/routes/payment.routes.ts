import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { verifyPayment } from "../controllers/payment.controller";

const router : Router = express.Router();

router.route('/verify').post(isAuthenticated, verifyPayment);

export default router;