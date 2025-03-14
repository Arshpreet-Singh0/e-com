import ProductsPage from "@/components/products/AllProductsPage";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";

const getProducts = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/product/topproducts`);
        return res.data?.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    // ✅ Ensure searchParams.search is a string
    const s = await searchParams;
    const searchQuery =
        typeof s?.search === "string" ? s.search : "";

    const products = await getProducts();

    return <ProductsPage products={products} searchQuery={searchQuery} />;
}
