import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { createProduct, getAllProducts, getProductById, getProductRecomendations, getTopProducts, updateProduct } from "../controllers/product.controller";
const router : Router = express.Router();

router.route('/').post(isAuthenticated, isAdmin, createProduct);

router.route('/').get(getAllProducts);

router.route('/:productId').put(isAuthenticated, isAdmin, updateProduct);

router.route('/topproducts').get(getTopProducts);

router.route('/:productId').get(getProductById);

router.route('/:productId/recommendation').get(getProductRecomendations);


export default router;