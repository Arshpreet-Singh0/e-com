import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller";

const router : Router = express.Router();

router.route('/').get(isAuthenticated, getCart);

router.route('/').post(isAuthenticated, addToCart);

router.route('/').delete(isAuthenticated, removeFromCart);


export default router;