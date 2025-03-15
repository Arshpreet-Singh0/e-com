import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import productSchema from "../validations/productValidation";
import generateEmbedding from "../config/embeddings"
import { getSimilarProducts } from "../utils/getSimilarProducts";
import { s3 } from "../config/awsconfig";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsedData = productSchema.safeParse(req.body);

        if (parsedData.error) {
            res.status(400).json({
                message: "All fields are required",
                error: parsedData.error
            });
            return;
        }

        // Combine multiple fields into a single string for embedding
        const { name, category, description, tags } = parsedData.data;
        const embeddingInput = `${name} ${category} ${description} ${tags?.join(" ") || ""}`;

        // Generate embedding using Gemini API
        const embedding = await generateEmbedding(embeddingInput);

        if (!embedding) {
            res.status(500).json({
                message: "Failed to generate embeddings",
                success: false
            });
            return;
        }

        // Store product data along with embedding in the database
        await prisma.product.create({
            data: {
                ...parsedData.data,
                embedding // Save embedding vector
            }
        });

        res.status(200).json({
            message: "Product created successfully",
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

export const getTopProducts = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const  products = await prisma.product.findMany({
            where : {
                disabled : false
            },
            take : 6,
            orderBy : {
                createdAt : 'desc'
            }
        });

        res.status(200).json({
            products
        })
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { productId } = req.params;
        const parsedData = productSchema.safeParse(req.body);

        if(parsedData.error){
            res.status(400).json({
                message : "All fields are reuired",
                error : parsedData.error
            })
            return;
        }

        await prisma.product.update({
            where : {
                id : productId
            },
            data : parsedData.data
        });

        res.status(200).json({
            messgae : "Product updated successfully",
            success : true,
        })
    } catch (error) {
        next(error);
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const {productId} = req.params;

        const product = await prisma.product.findUnique({
            where : {
                id : productId
            },
        });

        res.status(200).json(product);
    } catch (error) {
        next(error);
        
    }
}

export const getProductRecomendations = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const {productId} = req.params;

        const result = await getSimilarProducts(productId);
          
        res.status(200).json(result);
    } catch (error) {
        
    }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const products = await prisma.product.findMany({});

        res.status(200).json(products)
    } catch (error) {
        next(error);
    }
}

export const generatePresignedUrls = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const { fileNames }: { fileNames: string[] } = req.body; // Ensure fileNames is an array
  
      if (!Array.isArray(fileNames) || fileNames.length === 0) {
        res.status(400).json({ success: false, message: "Invalid file names array" });
        return;
      }
  
      const urls = await Promise.all(
        fileNames.map(async (fileName) => {
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME, // Replace with actual bucket name
            Key: `uploads/${fileName}`,
            ContentType: "image/jpeg", // Adjust if needed
          });
  
          const url = await getSignedUrl(s3, command, { expiresIn: 60 });
          return { fileName, url };
        })
      );

      res.json({ success: true, urls });
    } catch (error) {
      console.error("Error generating pre-signed URLs:", error);
      next(error);
    }
  };