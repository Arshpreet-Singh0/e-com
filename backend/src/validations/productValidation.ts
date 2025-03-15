import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),

  description: z
    .string()
    .min(10, { message: "Description should be at least 10 characters" }),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num > 0, {
      message: "Price must be a positive number",
    }),

  stock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, {
      message: "Stock must be a non-negative number",
    }),

  brand: z.string().optional(),

  sizes: z.array(z.string()).nonempty({ message: "Sizes are required" }),

  images : z.array(z.string()).nonempty({ message: "Images are required" }),

  tags: z.array(z.string()).default([]),

  discount: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, {
      message: "Discount must be a non-negative number",
    }).optional(),

    category : z.string(),
});

export default productSchema;
