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
    const { productId, quantity, size } = parsedData.data;

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
      where: { cartId: cart.id, productId , size},
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id , size},
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size
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

    res.status(200).json({
      cart : updatedCart,
      message : "Product added to cart",
      success : true,
    });
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
    const {cartItemId} = req.params;
    const cart = await getOrCreateCart(userId);
    

    await prisma.cartItem.delete({
      where: { cartId: cart.id, id : cartItemId },
    });
    const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } }, // Ensure product details are included
      });
  
      res.status(200).json({
        cart : updatedCart,
        message : "Product removed from cart",
        success : true,
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

export const syncCart = async (req : Request, res: Response, next : NextFunction) : Promise<void> => {
  try {
    const { items } = req.body;
    const userId = req.userId;

    if (!userId || !Array.isArray(items)) {
      res.status(400).json({ message: "Invalid request data" });
      return;
    }

    // Fetch user's cart along with existing items
    let cart = await getOrCreateCart(userId);

    const cartId = cart.id;
    const existingItemsMap = new Map(
      cart.items.map((item) => [item.productId, item])
    );

    const newItems: { cartId: string; productId: string; quantity: number; size?: string }[] = [];
    const updatedItems: { id: string; quantity: number; size?: string }[] = [];
    const itemsToDelete: string[] = [];

    // Compare and prepare batch operations
    items.forEach(({ product, quantity, size }) => {
      if (quantity === 0) {
        if (existingItemsMap.has(product?.id)) {
          itemsToDelete.push(product?.id);
        }
      } else if (existingItemsMap.has(product?.id)) {
        const existingItem = existingItemsMap.get(product?.id)!;
        if (existingItem.quantity !== quantity || existingItem.size !== size) {
          updatedItems.push({ id: existingItem.id, quantity, size });
        }
      } else {
        newItems.push({ cartId, productId : product?.id, quantity, size });
      }
    });

    // Execute all database operations in a single transaction
    await prisma.$transaction([
      ...newItems.map((item) => prisma.cartItem.create({ data: item })),
      ...updatedItems.map((item) =>
        prisma.cartItem.update({
          where: { id: item.id },
          data: { quantity: item.quantity, size: item.size },
        })
      ),
      prisma.cartItem.deleteMany({
        where: { cartId, productId: { in: itemsToDelete } },
      }),
    ]);

    // Fetch updated cart in a single query
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }, // Ensure product details are included
    });

    res.json({ message: "Cart synced successfully", cart: updatedCart });
  } catch (error) {
    console.error("Cart sync error:", error);
    next(error);
  }
};
