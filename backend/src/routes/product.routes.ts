import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { createProduct, getProductById, getProductRecomendations, getProducts, updateProduct } from "../controllers/product.controller";
const router : Router = express.Router();

router.route('/').post(isAuthenticated, isAdmin, createProduct);

router.route('/:productId').put(isAuthenticated, isAdmin, updateProduct);

router.route('/').get(getProducts);

router.route('/:productId').get(getProductById);

router.route('/:productId/recommendation').get(getProductRecomendations);

export default router;