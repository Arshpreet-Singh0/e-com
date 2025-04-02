import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { z } from "zod";
import Razorpay from "razorpay";


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
            select: { id: true, price: true, discount : true },
        });

        const productPriceMap = new Map(products.map(product => {
            const finalPrice = Math.max(0, product.price - (product.price*(product?.discount || 0)/100 || 0)); // Ensure price is not negative
            return [product.id, finalPrice];
        }));



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

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string | undefined = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                            },
                        },
                    },
                },
                address: true,
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : error });
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {orderId} = req.params;

        const {status, trackingNumber} = req.body;
        if (!orderId || !status || !trackingNumber) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        await prisma.order.update({
            where : {
                id : orderId,
            },
            data : {
                status,
            }
        })
    } catch (error) {
        next(error);
    }
}
