import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Zod Schema for Order Validation
const orderSchema = z.object({
    addressId: z.string().min(1, "Address ID is required"),
    items: z.array(
        z.object({
            productId: z.string().min(1, "Product ID is required"),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            size: z.string().min(1, "Size is required"),
        })
    ).nonempty("Items cannot be empty"),
});

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log(req.body);
        
        const userId: string | undefined = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Validate request body with Zod
        const parsedBody = orderSchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ message: "Invalid order details", errors: parsedBody.error.errors });
            return;
        }

        const { addressId, items } = parsedBody.data;

        // Fetch product prices from the database
        const productIds = items.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true },
        });

        const productPriceMap = new Map(products.map(product => [product.id, product.price]));

        const totalAmount: number = items.reduce((acc, item) => {
            const price = productPriceMap.get(item.productId);
            if (!price) throw new Error(`Product price not found for productId: ${item.productId}`);
            return acc + price * item.quantity;
        }, 0);
        const razorpayOrder  = await razorpay.orders.create({
            amount: Number(totalAmount) * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
        
        // console.log(razorpayOrder); // Check the actual response

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId,
                addressId,
                items: { create: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size,
                    price: productPriceMap.get(item.productId)!,
                })) },
                totalAmount,
                paymentStatus : "pending", // Initial status
                razorpayOrderId : razorpayOrder.id,
            },
        });

        // Create Razorpay order

        res.status(201).json({
            message: "Order created successfully",
            order,
            razorpayOrder,
            key : process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : error });
    }
};

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
            data: { status: "paid", razorpayPaymentId : paymentId },
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
                status: updatedOrder.status,
                date: new Date(updatedOrder.createdAt).toLocaleString(),
            },
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ status: "FAILED", message: "Internal Server Error", error: error instanceof Error ? error.message : error });
    }
};
