import express, { Router } from "express";
import { resendOtp, sendOtp, verifyOtp } from "../controllers/user.controller";
const router : Router = express.Router();

router.route('/getotp').post(sendOtp);

router.route('/verifyotp').post(verifyOtp);

router.route('/resendotp').post(resendOtp);

export default router;