import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { createProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";
const router : Router = express.Router();

router.route('/').post(isAuthenticated, isAdmin, createProduct);

router.route('/:productId').put(isAuthenticated, isAdmin, updateProduct);

router.route('/').get(getProducts);

router.route('/:productId').get(getProductById);

export default router;