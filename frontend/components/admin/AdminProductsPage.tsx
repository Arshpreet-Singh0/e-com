"use client";

import { Search } from "lucide-react";
import { Product } from '@/types/types'
import Actions from "./Actions";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils/handleAxiosError";
import Image from "next/image";

const AdminProductsPage = ({products} : {
    products : Product[]
}) => {
    const handleDelete = async(id : string) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/admin/product/${id}/disable`, {}, {
                withCredentials : true
            });

            if(res?.data?.success){
                toast.success( res.data?.message ||'Product deleted successfully');
            }
        } catch (error) {
            console.log(error);
            
            handleAxiosError(error);
        }
    }
  return (
    <div className="w-dull">
    <div className="p-6 w-[90%] mx-auto">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            //   value={searchTerm}
            //   onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
        <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
          <option>All Categories</option>
          <option>{"Men's Jeans"}</option>
          <option>{"Women's Jeans"}</option>
          <option>Sale Items</option>
        </select>
      </div>
    </div>
        <div className="bg-white rounded-lg shadow w-[80%] mx-auto">
    {/* Search and Filters */}

    {/* Product Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Colors
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product: Product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0">
                    <Image
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded"
                      height={100}
                      width={100}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {product.id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product?.stock}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₹{product?.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product?.discount || 0} % </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap"> */}
                {/* <div className="flex space-x-1">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div> */}
              {/* </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Actions productId={product?.id} handleDelete={handleDelete}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to {products.length} of {products.length} results
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  </div></div>
  )
}

export default AdminProductsPage