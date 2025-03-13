"use client";

import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const NewProductForm: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>(['#000000']);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, this would upload to a server and get URLs back
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const addColor = () => {
    setColors([...colors, '#000000']);
  };


  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow md:p-8 p-4">
      <form className="space-y-8 md:w-[60%] mx-auto border rounded-xl p-8" >
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
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select className='form-select mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                discount
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
                <input
                  type="number"
                  className="block w-full pl-7 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="10"
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
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
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
        </div>

        {/* Colors */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Colors</h3>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus size={16} className="mr-1" />
              Add Color
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Description</h3>
          <textarea
            rows={4}
            className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter product description..."
          />
        </div>

        {/* Sizes and Stock */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Sizes and Stock</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {size}
                </label>
                <input
                  type="number"
                  min="0"
                  className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}
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