import prisma from "../config/prisma";

export async function getSimilarProducts(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return;

    const similarProducts = await prisma.$queryRaw`
      SELECT id, name, category, images, price, discount, 
          cosine_similarity(embedding, ${JSON.stringify(
            product.embedding
          )}::jsonb) AS similarity
      FROM "Product"
      WHERE id != ${productId}
      AND category = ${product.category} -- Only match within the same category
      AND ABS(price - ${product.price}) < 50 -- Only match within a price range
      ORDER BY similarity DESC
      LIMIT 5;
    `;

    return similarProducts;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    
  }
}
