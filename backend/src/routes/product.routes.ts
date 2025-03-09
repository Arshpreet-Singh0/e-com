import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { createProduct, getProducts, updateProduct } from "../controllers/product.controller";
const router : Router = express.Router();

router.route('/').post(isAuthenticated, isAdmin, createProduct);

router.route('/').put(isAuthenticated, isAdmin, updateProduct);

router.route('/').get(getProducts);

export default router;