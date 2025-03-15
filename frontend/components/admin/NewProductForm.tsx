"use client";

import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { BACKEND_URL } from '@/config/config';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useRouter } from 'next/navigation';

interface Product {
  name: string;
  description: string;
  discount: number;
  price: number;
  images: string[]; // Array of image URLs
  tags: string[]; // Array of tags
  category: string;
  sizes: string[]; // Array of sizes (e.g., ["S", "M", "L"])
  stock: number;
}

const NewProductForm: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [sizes, setSizes] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    discount: 0,
    price: 0,
    images: [],
    tags: [],
    category: "",
    sizes: [],
    stock: 0,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const file of selectedFiles) {
        
        if (file.size > maxSize) {
          toast.error(`File size must not exceed 5MB.`);
          return;
        }
      }

      const newImages = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      setFiles((f) => [...f, ...selectedFiles]);
    }
  };

  const getSignedURLs = async () => {
    const fileNames = files.map((f) => f.name);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/product/generate-urls`, { fileNames }, {
        withCredentials: true
      });

      if (res?.data?.success) {
        return res.data?.urls;
      }
    } catch (error) {
      console.log(error);
      handleAxiosError(error);
    }
  }

  const uploadFiles = async (preSignedUrls: { url: string }[]) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const { url } = preSignedUrls[index]; // Get the corresponding URL
        const config = {
          headers: {
            "Content-Type": file.type, // Ensure proper file type
          },
          onUploadProgress: (progressEvent : any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        };

        const response = await axios.put(url, file, config);

        if (response.status === 200) {
          console.log(`Uploaded ${file.name} successfully`);
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      handleAxiosError(error);
      console.error("Error uploading files:", error);
    }
  };

  const getImageUrls = (preSignedUrls: { url: string }[]) => {
    return preSignedUrls.map(({ url }) => {
      const baseUrl = url.split("?")[0]; // Remove query parameters
      return baseUrl;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    product.sizes = sizes.split(",").map((s) => s.trim());
    product.tags = tags.split(",").map((t) => t.trim());
    if (!product.name || !product.category || !product.description || !product.price || sizes.length == 0 || tags.length == 0 || files.length == 0) {
      toast.error("All fields are required.");
      return;
    }

    let toastId = toast.loading("Uploading Images...");

    try {
      const urls = await getSignedURLs();
      await uploadFiles(urls);
      toast.dismiss(toastId);
      toast.success("Upload Successful!", {
        description: "Your files have been uploaded successfully.",
      });

      toastId = toast.loading("Saving Product...");

      product.images = getImageUrls(urls);

      const res = await axios.post(`${BACKEND_URL}/api/v1/product`, product, {
        withCredentials: true
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        router.push('/admin');
      }
    } catch (error) {
      handleAxiosError(error);
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow md:p-8 p-4">
      <form className="space-y-8 md:w-[75%] xl:w-[60%] mx-auto border rounded-xl p-8 bg-gray-50 shadow-xl" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter product name"
                value={product.name}
                name='name'
                onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}
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
                  name='price'
                  value={product.price}
                  onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select className='form-select mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent' name='category' onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}>
                <option defaultValue={""} value={product.category}>Select category</option>
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
                  name='discount'
                  value={product.discount}
                  onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== index));
                    setFiles(files.filter((_, i) => i !== index))
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
              <Upload size={24} className="text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <progress value={uploadProgress} max="100" />
            <span>Uploading... {uploadProgress}%</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Description</h3>
          <textarea
            rows={4}
            className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter product description..."
            name='description'
            value={product.description}
            onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}
          />
        </div>

        {/* Sizes and Stock */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Sizes (comma separated)</h3>
          <div className="w-full">
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter sizes"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Stock</h3>
          <div className="w-full">
            <input
              type="number"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter stock"
              value={product.stock}
              name='stock'
              onChange={(e) => setProduct((p) => ({ ...p, [e.target.name]: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Tags (comma separated)</h3>
          <div className="w-full">
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;
