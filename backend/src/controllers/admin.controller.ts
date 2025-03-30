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

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include : {
                items : {
                    include : {
                        product : {
                            select : {
                                id : true,
                                name : true,
                                price : true,
                                images : true,
                            }
                        }
                    }
                },
                user : {
                    select : {
                        id : true,
                        name : true,
                        email : true,
                        phone : true,
                        
                    }
                },
                address : true
            },
            orderBy : {
                createdAt : 'desc'
            }
        });

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}