import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1f4d] text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-yellow-400 text-xl font-bold mb-4">FoodMania</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Delivering delicious food to your doorstep with love and care. 
              Experience the best flavors from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="/dishes" className="text-gray-300 hover:text-yellow-400 transition-colors">Menu</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@foodmania.com</p>
              <p>📍 123 Food Street, Flavor City</p>
              <p>🕒 Mon-Sun: 9AM - 11PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 FoodMania. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
