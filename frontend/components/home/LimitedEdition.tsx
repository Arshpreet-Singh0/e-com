import { Crown } from "lucide-react"
import Image from "next/image"


const LimitedEdition = () => {
  return (
    <section className="relative bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Limited Edition Collection</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Exclusive designs available for a limited time only
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative group">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=500"
                    alt="Limited Edition"
                    className="w-full h-96 object-cover"
                    width={100}
                    height={100}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Vintage Wash Collection</h3>
                    <p className="text-gray-200 mb-4">Limited to 100 pieces</p>
                    <button className="w-full bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default LimitedEdition