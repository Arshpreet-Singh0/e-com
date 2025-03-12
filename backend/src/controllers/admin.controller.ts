import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            where : {
                disabled : false
            }
        });

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

export const disableProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {productId} = req.params;

        await prisma.product.update({
            where : {
                id : productId
            },
            data : {
                disabled : true
            }
        });

        res.status(200).json({
            message : "Product Disabled successfully",
            success : true,
        });
    } catch (error) {
        next(error);   
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {productId} = req.params;
        
        await prisma.product.delete({
            where : {
                id : productId
            }
        });

        res.status(200).json({
            message : "Product Deleted successfully",
            success : true,
        });
    } catch (error) {
        next(error);
    }
}
