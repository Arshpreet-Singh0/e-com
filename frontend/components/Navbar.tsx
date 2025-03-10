"use client";

import { BACKEND_URL } from "@/config/config";
import { clearUser } from "@/lib/store/features/authSlice";
import { openLoginModal } from "@/lib/store/features/loginModalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import axios from "axios";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Heart,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(clearUser());
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold ml-2 sm:ml-0">DENIM CO.</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-black flex items-center"
            >
              Men <ChevronDown size={16} className="ml-1" />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black flex items-center"
            >
              Women <ChevronDown size={16} className="ml-1" />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black flex items-center"
            >
              Sale <ChevronDown size={16} className="ml-1" />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search size={24} />
            </button>
            <button className="p-2">
              <Heart size={24} />
            </button>
            <button className="p-2">
              <ShoppingCart size={24} />
            </button>
            {user !== null ? (
              <>
                <p>{user?.name}</p>
                <button
                  className="p-2 flex items-center text-gray-700 hover:text-black"
                  onClick={handleLogOut}
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <button
                className="p-2 flex items-center text-gray-700 hover:text-black"
                onClick={() => dispatch(openLoginModal())}
              >
                <User size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-700">
              Men
            </a>
            <a href="#" className="block px-3 py-2 text-gray-700">
              Women
            </a>
            <a href="#" className="block px-3 py-2 text-gray-700">
              Sale
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
