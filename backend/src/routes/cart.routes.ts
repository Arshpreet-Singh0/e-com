import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addToCart, getCart, removeFromCart, syncCart } from "../controllers/cart.controller";

const router : Router = express.Router();

router.route('/').get(isAuthenticated, getCart);

router.route('/').post(isAuthenticated, addToCart);

router.route('/:cartItemId').delete(isAuthenticated, removeFromCart);

router.route('/sync').post(isAuthenticated, syncCart);


export default router;