"use client";

import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Search, Heart, ChevronDown, User } from 'lucide-react';
import ProductCard from '../ProductCard';
import LoginModal from '../auth/LoginModal';
import { products } from '../product';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
              <a href="#" className="text-gray-700 hover:text-black flex items-center">
                Men <ChevronDown size={16} className="ml-1" />
              </a>
              <a href="#" className="text-gray-700 hover:text-black flex items-center">
                Women <ChevronDown size={16} className="ml-1" />
              </a>
              <a href="#" className="text-gray-700 hover:text-black flex items-center">
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
              <button 
                className="p-2 flex items-center text-gray-700 hover:text-black"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700">Men</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Women</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Sale</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="h-[600px] w-full bg-cover bg-center" style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-4">Premium Denim Collection</h2>
              <p className="text-xl mb-8">Discover your perfect fit</p>
              <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Our Story</a></li>
                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="hover:text-gray-300">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">FAQs</a></li>
                <li><a href="#" className="hover:text-gray-300">Shipping</a></li>
                <li><a href="#" className="hover:text-gray-300">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Email Us</a></li>
                <li><a href="#" className="hover:text-gray-300">Live Chat</a></li>
                <li><a href="#" className="hover:text-gray-300">Store Locator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Subscribe for exclusive offers and updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-md w-full text-black"
                />
                <button className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-100">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

export default HomePage;