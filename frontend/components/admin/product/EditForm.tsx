"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { useRouter } from "next/navigation";
import { Product } from "@/types/types";


const EditProductForm = ({ product }: { product: Product }) => {
  const [updatedProduct, setUpdatedProduct] = useState<Product>(product);
  const [tags, setTags] = useState<string>(product.tags.join(", "));
  const router = useRouter();
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      ...updatedProduct,
      tags: tags.split(",").map((t) => t.trim()),
    };

    if (!updatedData.name || !updatedData.category || !updatedData.description || !updatedData.price) {
      toast.error("All fields are required.");
      return;
    }

    console.log(updatedData);
    

    let toastId = toast.loading("Saving Product...");

    try {
      const res = await axios.put(`${BACKEND_URL}/api/v1/product/${product.id}`, updatedData, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success("Product updated successfully!");
        router.push("/admin");
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...updatedProduct.sizes];
    newSizes[index].quantity = Number(value);
    setUpdatedProduct({ ...updatedProduct, sizes: newSizes });
  };

  return (
    <div className=" md:p-8 p-4">
      <form className="space-y-8 md:w-[75%] xl:w-[60%] mx-auto border rounded-xl p-8 bg-gray-50 shadow-xl" onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter product name"
                value={updatedProduct.name}
                name="name"
                onChange={(e) =>
                  setUpdatedProduct((p) => ({ ...p, [e.target.name]: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  className="block w-full pl-7 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="0.00"
                  name="price"
                  value={product.price}
                  onChange={(e) =>
                    setUpdatedProduct((p) => ({
                      ...p,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="form-select mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                name="category"
                onChange={(e) =>
                 setUpdatedProduct((p) => ({ ...p, [e.target.name]: e.target.value }))
                }
              >
                <option defaultValue={""} value={updatedProduct.category}>
                  Select category
                </option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
                <input
                  type="number"
                  className="block w-full pl-7 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="10"
                  name="discount"
                  value={updatedProduct.discount}
                  onChange={(e) =>
                    setUpdatedProduct((p) => ({
                      ...p,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>


          <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Description</h3>
          <textarea
            rows={4}
            className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter product description..."
            name="description"
            value={updatedProduct.description}
            onChange={(e) =>
              setUpdatedProduct((p) => ({ ...p, [e.target.name]: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma, seperated)</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border rounded-lg"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Sizes</label>
          <div className="flex flex-wrap gap-10">

          {sizeOptions.map((size, index) => (
            <div key={size} className="flex items-center flex-col space-x-2">
              <label className="w-12">{size}</label>
              <input
                type="number"
                className="px-2 py-1 border rounded-lg w-20 mt-2"
                value={updatedProduct.sizes[index]?.quantity || 0}
                onChange={(e) => handleSizeChange(index, e.target.value)}
              />

            </div>
          ))}
          </div>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProductForm;
