import ProductDetails from "@/components/products/ProductDetails";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";

const getProducts = async (id: string) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Failed to fetch product details");
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const id = (await params).id;
    const product = await getProducts(id);

    return (
      <>
        <ProductDetails product={product} />
      </>
    );
  } catch (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <p>Failed to load product details. Please try again later.</p>
      </div>
    );
  }
}
