import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              FoodMania
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Delicious food delivered to your doorstep. Experience the finest cuisine with our premium delivery service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="/dishes" className="text-gray-300 hover:text-yellow-400 transition-colors">Menu</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p> +1 (555) 123-4567</p>
              <p> info@foodmania.com</p>
              <p> 123 Food Street, Flavor City</p>
              <p> Mon-Sun: 9AM - 11PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 FoodMania. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
