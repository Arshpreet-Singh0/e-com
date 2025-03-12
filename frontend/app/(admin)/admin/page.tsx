import AdminProductsPage from "@/components/admin/AdminProductsPage";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { cookies } from "next/headers";

const getProducts = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");
  if (!token) return [];
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/admin/products`, {
      headers: {
        Cookie: `token=${token.value}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export default async function Page() {
  const products = await getProducts();
  return (
    <AdminProductsPage products={products} />
  );
}
