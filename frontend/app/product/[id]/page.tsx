import ProductDetails from "@/components/products/ProductDetails";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";

const getProducts = async (id: string) => {
  const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`);
  return res.data;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const product = await getProducts(id);

  return (
    <>
      <ProductDetails product={product} />
    </>
  );
}
