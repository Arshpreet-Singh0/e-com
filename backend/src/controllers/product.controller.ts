import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import productSchema from "../validations/productValidation";
import generateEmbedding from "../config/embeddings"

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

export const getProducts = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const  products = await prisma.product.findMany({
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

        async function getSimilarProducts(productId : string) {
            const product = await prisma.product.findUnique({ where: { id: productId } });
        
            if(!product) return;
          
            const similarProducts = await prisma.$queryRaw`
              SELECT id, name, category, images,
                     cosine_similarity(embedding, ${JSON.stringify(product.embedding)}::jsonb) AS similarity
              FROM "Product"
              WHERE id != ${productId}
              ORDER BY similarity DESC
              LIMIT 5;
            `;
          
            return similarProducts;
          }
          
          // Call this when showing product details
          const result = await getSimilarProducts("88ad952a-d557-4109-a37d-6aeb4f248edd");
          

        res.status(200).json(result);
    } catch (error) {
        next(error);
        
    }
}