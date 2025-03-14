"use client";

import { BACKEND_URL } from "@/config/config";
import { clearUser } from "@/lib/store/features/authSlice";
import { clearCart, toggleCartDrawer } from "@/lib/store/features/cartSlice";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);

  const handleOpenCart = () => {
      dispatch(toggleCartDrawer());
  }

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/logout`, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(clearUser());
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Define categories and their dropdown items
  const categories = [
    { name: "Men", items: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Bootcut"] },
    { name: "Women", items: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Bootcut"] },
    { name: "Sale", items: ["Discounted Items", "Clearance Sale"] },
  ];

  // Handle mouse enter
  const handleMouseEnter = (category : string) => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setHoveredMenu(category);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredMenu(null);
    }, 200); // Delay of 200ms before hiding menu
    setMenuTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (menuTimeout) clearTimeout(menuTimeout);
    };
  }, [menuTimeout]);

  return (
    <nav className="w-full bg-white shadow-sm z-50 text-black sticky top-0">
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
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href="#"
                  className="text-gray-700 hover:text-black flex items-center"
                >
                  {category.name}
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-200 ${
                      hoveredMenu === category.name ? "rotate-180" : ""
                    }`}
                  />
                </a>

                {/* Dropdown Menu */}
                {hoveredMenu === category.name && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white shadow-md p-2 rounded-lg"
                    onMouseEnter={() => handleMouseEnter(category.name)} // Keep open if hovered
                    onMouseLeave={handleMouseLeave} // Allow smooth transition
                  >
                    <ul className="text-gray-700">
                      {category.items.map((item, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search size={24} />
            </button>
            <button className="p-2">
              <Heart size={24} />
            </button>
            <button className="p-2" onClick={handleOpenCart}>
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
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="block px-3 py-2 text-gray-700"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
