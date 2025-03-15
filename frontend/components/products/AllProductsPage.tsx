"use client";

import React, { useEffect, useState } from 'react';
import { Sliders, Search} from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types/types';

const CATEGORIES = [
    { text: "All", value: "All" },
    { text: "Men's Jeans", value: "Men" },
    { text: "Women's Jeans", value: "Women" },
    { text: "Sale Items", value: "Sale" },
  ];
  
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#000000', '#1B365D', '#3B3B3B', '#7C7C7C', '#A6A6A6'];
const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: 'Over $150', min: 150, max: Infinity },
];

const ProductsPage = ({products, searchQuery} : {
    products : Product[],
    searchQuery : string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<typeof PRICE_RANGES[0] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  // Filter products based on all criteria
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'All' || product.category === selectedCategory
    )
    .filter(product => 
      selectedSizes.length === 0 || 
      product.sizes.some(size => selectedSizes.includes(size.size))
    )
    .filter(product => 
      !selectedPriceRange ||
      (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    useEffect(()=>{
        setSearchTerm(searchQuery || "");
    }, [searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      {/* <div className="">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
        </div>
      </div> */}

      <div className="w mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${
                      selectedCategory === category.value
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.text}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSizes(prev =>
                        prev.includes(size)
                          ? prev.filter(s => s !== size)
                          : [...prev, size]
                      );
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      selectedSizes.includes(size)
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColors(prev =>
                        prev.includes(color)
                          ? prev.filter(c => c !== color)
                          : [...prev, color]
                      );
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColors.includes(color)
                        ? 'border-black ring-2 ring-black ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${
                      selectedPriceRange === range
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                >
                  <Sliders size={20} />
                  Filters
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden mb-6 p-4 bg-white rounded-lg shadow space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedCategory === category.value
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev =>
                            prev.includes(size)
                              ? prev.filter(s => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg ${
                          selectedSizes.includes(size)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColors(prev =>
                            prev.includes(color)
                              ? prev.filter(c => c !== color)
                              : [...prev, color]
                          );
                        }}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColors.includes(color)
                            ? 'border-black ring-2 ring-black ring-offset-2'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`block w-full text-left px-4 py-2 rounded-lg ${
                          selectedPriceRange === range
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                //   onProductClick={setSelectedProduct}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;