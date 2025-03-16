import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['FAQ', 'Shipping', 'Returns', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Instagram className="w-6 h-6" />
                <Facebook className="w-6 h-6" />
                <Twitter className="w-6 h-6" />
                <Youtube className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <p className="text-gray-400">
                We accept all major credit cards and PayPal
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <p className="text-gray-400">
                Monday - Friday: 9am - 5pm EST
                <br />
                support@denimco.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 DENIM CO. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}
