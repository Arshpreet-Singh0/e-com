import express, { Router } from "express";
import { getAddress, getUser, logout, resendOtp, saveAddress, sendOtp, verifyOtp } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const router : Router = express.Router();

router.route('/getotp').post(sendOtp);

router.route('/verifyotp').post(verifyOtp);

router.route('/resendotp').post(resendOtp);

router.route('/me').get(isAuthenticated, getUser);

router.route('/logout').get(logout);

router.route('/address').get(isAuthenticated, getAddress);

router.route('/address').post(isAuthenticated, saveAddress);

export default router;