import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
});
