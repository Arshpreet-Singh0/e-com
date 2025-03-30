import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { deleteProduct, disableProduct, getOrders, getProducts } from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/isAdmin";
const router : Router = express.Router();

router.route('/products').get(isAuthenticated, isAdmin, getProducts);

router.route('/product/:productId').delete(isAuthenticated, isAdmin, deleteProduct);

router.route('/product/:productId/disable').post(isAuthenticated, isAdmin, disableProduct);

router.route('/orders').get(isAuthenticated, isAdmin, getOrders)

export default router;