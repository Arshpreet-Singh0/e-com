import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { addToCartSchema } from "../validations/cartValidator";

// Get or create cart
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const cart = await getOrCreateCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Add product to cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    const parsedData = addToCartSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }
    const { productId, quantity } = parsedData.data;

    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (!productId || quantity <= 0) {
      res.status(400).json({ message: "Invalid product or quantity" });
      return;
    }

    const cart = await getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: {select : {
        id : true,
        images : true,
        name : true,
        price : true,
        discount : true,
      }} } } }, // Ensure product details are included
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const {productId} = req.params;
    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } }, // Ensure product details are included
      });
  
      res.status(200).json(updatedCart);await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function: Get or create cart
async function getOrCreateCart(userId: string) {
  return await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { items: { include: { product: true } } },
  });
}
