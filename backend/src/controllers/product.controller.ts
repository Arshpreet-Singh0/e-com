import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import productSchema from "../validations/productValidation";

export const createProduct = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const parsedData = productSchema.safeParse(req.body);

        if(parsedData.error){
            res.status(400).json({
                message : "All fields are reuired",
                error : parsedData.error
            })
            return;
        }

        await prisma.product.create({
            data : parsedData.data
        });

        res.status(200).json({
            messgae : "Product created successfully",
            success : true,
        })
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const  products = await prisma.product.findMany({
            take : 6
        });

        res.status(200).json({
            products
        })
    } catch (error) {
        next(error);
    }
}