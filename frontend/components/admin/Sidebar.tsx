"use client";

import { LayoutGrid, LogOut, Package, Plus, Settings } from "lucide-react"
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <button
            className={`w-full flex items-center px-6 py-4 text-left text-gray-600 hover:bg-gray-100`}
            onClick={()=>router.push('/admin')}
          >
            <Package size={20} className="mr-3" />
            Products
          </button>
          <button
            className={`w-full flex items-center px-6 py-4 text-left text-gray-600 hover:bg-gray-100`}
            onClick={()=>router.push('/admin/orders')}
          >
            <Package size={20} className="mr-3" />
            Orders
          </button>
          <button
            className={`w-full flex items-center px-6 py-4 text-left cursor-pointer text-gray-600 hover:bg-gray-50`}
            onClick={()=>router.push('/admin/newproduct')}
          >
            <Plus size={20} className="mr-3" />
            Add Product
          </button>
          <button className="w-full flex items-center px-6 py-4 text-left text-gray-600 hover:bg-gray-50">
            <LayoutGrid size={20} className="mr-3" />
            Categories
          </button>
          <button className="w-full flex items-center px-6 py-4 text-left text-gray-600 hover:bg-gray-50">
            <Settings size={20} className="mr-3" />
            Settings
          </button>
          <button className="w-full flex items-center px-6 py-4 text-left text-red-600 hover:bg-gray-50 mt-auto">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </div>
      </div>
  )
}

export default Sidebar