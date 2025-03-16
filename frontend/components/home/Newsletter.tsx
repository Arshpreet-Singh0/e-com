import { ArrowRight } from "lucide-react"

const Newsletter = () => {
  return (
    <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">
              Get 10% Off Your First Order
            </h2>
            <p className="text-gray-800 mb-8">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-l-md px-4 py-2 focus:outline-none border"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-r-md flex items-center"
                >
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
  )
}

export default Newsletter;