import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import ProductCard from "../products/ProductCard";
import { Product } from "@/types/types";

const getTopProducts = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/product/topproducts`);
        return res.data?.products;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export default async function TopProducts() {
    const products = await getTopProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product: Product) => (
                        <ProductCard key={product?.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No products found.</p>
            )}
        </div>  
    );
}
