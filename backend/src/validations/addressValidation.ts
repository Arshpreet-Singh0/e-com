import { z } from "zod";

export const addressSchema = z.object({

  fullName: z.string().min(1, { message: "Full name is required" }),

  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(10, { message: "Phone number cannot exceed 10 digits" }),

  street: z.string().optional(),

  city: z.string().min(1, { message: "City is required" }),

  state: z.string().min(1, { message: "State is required" }),

  country: z.string().min(1, { message: "Country is required" }),

  pincode: z.string().regex(/^\d{6}$/, { message: "Invalid pincode format" }),

  landmark: z.string().optional()
});
