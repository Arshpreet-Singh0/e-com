"use client";

import { openSizeChart } from "@/lib/store/features/loginModalSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ChevronRight, Ruler } from "lucide-react"
import Image from "next/image";

const Sizeguide = () => {
    const dispatch = useAppDispatch();
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="flex items-center space-x-2 mb-6">
                <Ruler className="w-6 h-6 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Fit</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Not sure about your size? Use our detailed size guide to find the perfect fit for your body type.
              </p>
              <button
                onClick={()=>dispatch(openSizeChart())}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Size Guide
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="relative h-64 lg:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800"
                alt="Size Guide"
                className="absolute inset-0 w-full h-full object-cover"
                height={100}
                width={100}
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default Sizeguide