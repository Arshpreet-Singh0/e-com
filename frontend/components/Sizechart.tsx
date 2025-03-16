"use client";

import React from 'react'
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeSizeChart } from '@/lib/store/features/loginModalSlice';

const Sizechart = () => {
    const {isSizeChartOpen} = useAppSelector(store=>store.modal);
    const dispatch = useAppDispatch();

    if(!isSizeChartOpen){
        return null;
    }

  return (
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
            isSizeChartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
                <button
                  onClick={()=>dispatch(closeSizeChart())}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Measurement Instructions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">How to Measure</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>1. Waist: Measure around your natural waistline</p>
                    <p>2. Hip: Measure around the fullest part of your hips</p>
                    <p>3. Inseam: Measure from crotch to ankle</p>
                    <p>4. Thigh: Measure around the fullest part of your thigh</p>
                  </div>
                </div>
    
                {/* Size Chart Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Size (US)</th>
                        <th className="px-4 py-3 text-left">Waist (inches)</th>
                        <th className="px-4 py-3 text-left">Hip (inches)</th>
                        <th className="px-4 py-3 text-left">Inseam (inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { size: 'S', waist: '24-25', hip: '34-35', inseam: '30' },
                        { size: 'M', waist: '26-27', hip: '36-37', inseam: '30' },
                        { size: 'L', waist: '28-29', hip: '38-39', inseam: '30' },
                        { size: 'XL', waist: '30-31', hip: '40-41', inseam: '30' },
                        { size: 'XXL', waist: '32-33', hip: '42-43', inseam: '30' },
                      ].map((row) => (
                        <tr key={row.size} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{row.size}</td>
                          <td className="px-4 py-3">{row.waist}</td>
                          <td className="px-4 py-3">{row.hip}</td>
                          <td className="px-4 py-3">{row.inseam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
    
                {/* Fit Guide */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fit Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Slim Fit</h4>
                      <p className="text-sm text-gray-600">Sits below waist, slim through hip and thigh</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Regular Fit</h4>
                      <p className="text-sm text-gray-600">Sits at waist, regular through hip and thigh</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Relaxed Fit</h4>
                      <p className="text-sm text-gray-600">Sits at waist, relaxed through hip and thigh</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Loose Fit</h4>
                      <p className="text-sm text-gray-600">Sits below waist, loose through hip and thigh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }


export default Sizechart