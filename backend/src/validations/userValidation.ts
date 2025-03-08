import {z} from "zod";

export const userSchema = z.object({
    name : z.string().min(3, "Name must be at least 3 characters"),
    phone : z.string().min(10, "Mobile number should have 10 digits").max(10, "Mobile number should have only 10 digits"),
})