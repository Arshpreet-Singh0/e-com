import prisma from "../config/prisma";

export async function getSimilarProducts(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return;

    const similarProducts = await prisma.$queryRaw`
  SELECT id, name, category, images, price, discount, 
      cosine_similarity(embedding::vector, ${JSON.stringify(
        product.embedding
      )}::vector) AS similarity
  FROM "Product"
  WHERE id != ${productId}
  AND category = ${product.category}
  AND ABS(price - ${product.price}) < 50
  AND disabled = false
  ORDER BY similarity DESC
  LIMIT 5;
`;

    return similarProducts;
  } catch (error) {
    console.error("Error fetching similar products:", error);
  }
}
