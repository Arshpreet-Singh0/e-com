import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import twilioClient from "../config/twillio";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config/secret';
import { userSchema } from "../validations/userValidation";
import { addressSchema } from "../validations/addressValidation";
import { error } from "console";

export const sendOtp = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const parsedData = userSchema.safeParse(req.body);
    if(parsedData.error){
     res.status(400).json({message: "Invalid name or phone number.", sucess : false});
      return;
    }
    const { phone, name } = parsedData.data;

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

    // await twilioClient.messages.create({
    //   body: `Your OTP for verification: ${otp}`,
    //   from: "+12694420564",
    //   to: `+91${phoneStr}`,
    // });
    console.log(otp);
    

    res.status(200).json({ message: "OTP sent successfully." , success : true});
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


    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      secure: process.env.NODE_ENV === "production", 
    })

    const updateduser = await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null },
      select : {
        name : true,
        phone : true,
        id : true,
        role : true
      }
    });

    res.status(200).json({ message: "OTP verified successfully.", user : updateduser , success :true});
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

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.userId;
    const user = await prisma.user.findUnique({ 
      where: { id },
      select : {
        name : true,
        phone : true,
        id : true,
        role : true
      }
    });
    
    res.status(200).json({ user, success : true });
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully." , success : true});
  } catch (error) {
    console.error("Error logging out:", error);
    next(error);
  }
}


export const saveAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsedData = addressSchema.safeParse(req.body);
    const userId = req.userId;

    if(!userId){
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if(parsedData.error){
      res.status(400).json({ message : "Invalid request data", success : false, error : parsedData.error });
      return;
    }

    await prisma.address.create({
      data  : {
        ...parsedData.data,
        userId
      }
    })

    const addresses = await prisma.address.findMany({
      where : {
        userId : req.userId,
      }
    });

    res.status(200).json({
      message : "address saved successfully",
      success : true,
      addresses
    })

  } catch (error) {
    next(error);
  }
}

export const getAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const address = await prisma.address.findMany({
      where : {
        userId : req.userId,
      }
    });

    res.status(200).json(address);
    
  } catch (error) {
    console.log(error);
    
  }
}