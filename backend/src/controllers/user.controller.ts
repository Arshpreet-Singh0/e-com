import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import twilioClient from "../config/twillio";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const sendOtp = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      res.status(400).json({ message: "Phone number is required." });
      return;
    }

    const phoneStr = phone.toString();

    let user = await prisma.user.findFirst({
      where: { phone: phoneStr },
    });

    if (!user) {
      if (!name) {
        res.status(400).json({ message: "Name is required for new users." });
        return;
      }
      user = await prisma.user.create({
        data: {
          phone: phoneStr,
          name,
        },
      });
    }

    const otp = crypto.randomInt(1000, 9999);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: otp.toString(), otpExpiry },
    });

    await twilioClient.messages.create({
      body: `Your OTP for verification: ${otp}`,
      from: "+12694420564",
      to: `+91${phoneStr}`,
    });

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    next(error);
  }
};


export const verifyOtp = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ message: "Phone and OTP are required." });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone.toString() },
    });

    if (!user || !user.otp || !user.otpExpiry) {
      res.status(400).json({ message: "Invalid OTP request." });
      return;
    }

    if (new Date() > user.otpExpiry) {
      res.status(400).json({ message: "OTP has expired. Please request a new one." });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP. Please try again." });
      return;
    }

    const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, {
      expiresIn: "7d",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null },
    });

    res.status(200).json({ message: "OTP verified successfully.", token, user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(error)
  }
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ message: "Phone number is required." });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { phone: phone.toString() },
    });

    if (!user) {
      res.status(404).json({ message: "User not found. Please register first." });
      return;
    }

    // Generate a new 4-digit OTP
    const otp = crypto.randomInt(1000, 9999);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: otp.toString(), otpExpiry },
    });

    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP for verification: ${otp}`,
      from: "+12694420564",
      to: `+91${phone}`,
    });

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    console.error("Error resending OTP:", error);
    next(error);
  }
};