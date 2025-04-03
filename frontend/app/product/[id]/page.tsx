import Loading from "@/components/Loading";
import ProductDetails from "@/components/products/ProductDetails";
import { SimilarProducts } from "@/components/products/SimilarProducts";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { Suspense } from "react";

// Lazy load the SimilarProducts component
// const SimilarProducts = dynamic(() => import("@/components/products/SimilarProducts"), {
//   ssr: false, // Ensure it's only loaded on the client
//   loading: () => <p className="text-center text-gray-500">Loading similar products...</p>,
// });

const getProduct = async (id: string) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`);
    return res.data;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const product = await getProduct(id);

    return (
      <>
        {product ? (
          <ProductDetails product={product} />
        ) : (
          <div className="h-screen text-center flex items-center justify-center">
            <p className="text-2xl font-semibold text-gray-600">Product not found</p>
          </div>
        )}

        {/* Use Suspense to show a fallback while SimilarProducts is loading */}
        <Suspense fallback={<Loading />}>
          <SimilarProducts id={id} />
        </Suspense>
      </>
    );
}
