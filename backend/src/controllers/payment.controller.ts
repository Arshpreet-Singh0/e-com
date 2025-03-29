import crypto from "crypto";
import { Request, Response } from "express";
import prisma from "../config/prisma";

// Verify Razorpay Payment
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, paymentId, signature, razorpay_order_id }: { orderId: string; paymentId: string; signature: string, razorpay_order_id : string } = req.body;
        console.log(req.body);

        console.log(req.body);
        
        

        if (!orderId || !paymentId || !signature || !razorpay_order_id) {
            res.status(400).json({ status: "FAILED", message: "Missing required payment details" });
            return;
        }

        // Generate HMAC SHA256 signature for verification
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${paymentId}`)
            .digest("hex");


        if (generatedSignature !== signature) {
            res.status(400).json({ status: "FAILED", message: "Invalid signature. Payment verification failed." });
            return;
        }

        // Update order status to "PAID"
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus : "paid", razorpayPaymentId : paymentId },
        });

        // Send payment details to frontend
        res.status(200).json({
            status: "SUCCESS",
            message: "Payment verified successfully",
            paymentDetails: {
                orderId: updatedOrder.id,
                userId: updatedOrder.userId,
                paymentId: updatedOrder.razorpayPaymentId,
                totalAmount: updatedOrder.totalAmount,
                currency: "INR",
                paymetStatus : updatedOrder.paymentStatus,
                date: new Date(updatedOrder.createdAt).toLocaleString(),
            },
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ status: "FAILED", message: "Internal Server Error", error: error instanceof Error ? error.message : error });
    }
};
