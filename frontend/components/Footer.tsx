import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">Our Story</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Careers</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">FAQs</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Shipping</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">Email Us</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Live Chat</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Store Locator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe for exclusive offers and updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-md w-full text-white border border-white"
              />
              <button className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
