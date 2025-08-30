import Navbar from '../components/Navbar';
import Footer from '../components/Footer.jsx';
import { FaHeart, FaRocket, FaUsers, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d327b] via-[#1e4a8c] to-[#0d327b] text-white font-fancy relative overflow-hidden">
      <Navbar/>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 md:px-20 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 mt-10">
          <h1 className="text-6xl md:text-8xl font-main bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent mb-6 leading-tight">
            ABOUT FOODMANIA
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            🍽️ Your ultimate culinary adventure awaits! We're not just delivering food — we're delivering <span className="font-bold text-amber-400">happiness, one bite at a time.</span>
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-amber-400 mb-2">50K+</div>
            <div className="text-gray-300">Happy Customers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-amber-400 mb-2">500+</div>
            <div className="text-gray-300">Restaurant Partners</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-amber-400 mb-2">1M+</div>
            <div className="text-gray-300">Orders Delivered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-amber-400 mb-2">15min</div>
            <div className="text-gray-300">Avg Delivery</div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-12 border border-white/20">
          <div className="flex items-center mb-6">
            <FaRocket className="text-4xl text-amber-400 mr-4" />
            <h2 className="text-4xl font-main text-amber-300">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-100 leading-relaxed">
            At FoodMania, we're on a mission to revolutionize how you experience food. We believe every meal should be an adventure, every bite should spark joy, and every delivery should exceed expectations. We're here to connect you with incredible flavors from the best kitchens in your city, delivered with lightning speed and unmatched care.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <FaHeart className="text-3xl text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-amber-300 mb-3">Curated with Love</h3>
            <p className="text-gray-200">Every restaurant partner is handpicked by our food experts. We taste-test everything to ensure you get only the best.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <FaClock className="text-3xl text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-amber-300 mb-3">Lightning Fast</h3>
            <p className="text-gray-200">Our AI-powered logistics ensure your food arrives hot, fresh, and faster than you can say "I'm hungry!"</p>
          </div>
          
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <FaShieldAlt className="text-3xl text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-amber-300 mb-3">Safe & Secure</h3>
            <p className="text-gray-200">Contactless delivery, secure payments, and hygiene-certified kitchens. Your safety is our top priority.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <FaStar className="text-3xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-amber-300 mb-3">Premium Quality</h3>
            <p className="text-gray-200">From street food gems to fine dining experiences, we bring you authentic flavors that tell a story.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <FaUsers className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-amber-300 mb-3">Community First</h3>
            <p className="text-gray-200">We support local restaurants, create jobs, and build a community of food lovers who share our passion.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-amber-300 mb-3">Eco-Friendly</h3>
            <p className="text-gray-200">Sustainable packaging, carbon-neutral delivery, and partnerships with eco-conscious restaurants.</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-16 border border-amber-400/20">
          <h2 className="text-4xl font-main text-amber-300 mb-6 text-center">Our Story</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-100 leading-relaxed mb-6">
              FoodMania started in 2020 when three food-obsessed friends realized that great food shouldn't be limited by location or time. What began as a small delivery service in Mumbai has grown into India's most loved food platform, serving millions of hungry souls across 50+ cities.
            </p>
            <p className="text-lg text-gray-100 leading-relaxed">
              Today, we're not just a food delivery app — we're a movement. A community of food lovers, restaurant partners, delivery heroes, and tech innovators working together to make every meal memorable. From midnight cravings to celebration feasts, we're here for every moment that matters.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-amber-400/20 to-yellow-400/20 backdrop-blur-md rounded-3xl p-12 border border-amber-400/30">
          <h3 className="text-3xl font-main text-amber-400 mb-4">
            Ready to Join the FoodMania Family?
          </h3>
          <p className="text-xl text-gray-200 mb-6">
            Download our app, explore incredible flavors, and become part of India's largest food community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-400 to-yellow-400 text-[#0d327b] font-bold py-3 px-8 rounded-xl hover:from-amber-300 hover:to-yellow-300 transition-all transform hover:scale-105">
              Order Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white font-bold py-3 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default About;
