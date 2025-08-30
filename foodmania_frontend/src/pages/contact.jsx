import { useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Footer from '../components/Footer.jsx';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeadset, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual endpoint when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just show success message
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d327b] via-[#1e4a8c] to-[#0d327b] text-white font-fancy relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 md:px-20 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <h1 className="text-5xl md:text-7xl font-main bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent mb-6 leading-tight">
            GET IN TOUCH
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            📬 We're here to help! Whether you're a food lover, restaurant partner, or just curious about FoodMania — <span className="font-bold text-amber-400">let's connect over great conversations and even better food.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-main text-amber-300 mb-6">Send us a Message</h2>
            
            {/* Success Message */}
            {success && (
              <div className="mb-6">
                <ErrorMessage 
                  message="Thank you! Your message has been sent successfully. We'll get back to you soon!"
                  type="info"
                  onClose={() => setSuccess(false)}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <ErrorMessage 
                  message={error}
                  type="error"
                  onClose={() => setError('')}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-amber-300 mb-2 font-semibold" htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-amber-300 mb-2 font-semibold" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-amber-300 mb-2 font-semibold" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400 resize-none transition-all"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0d327b] font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact Cards */}
            <div className="grid gap-6">
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaPhone className="text-2xl text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-amber-300">Call Us</h3>
                </div>
                <p className="text-gray-200 mb-2">Customer Support: <span className="text-white font-semibold">+91 98765 43210</span></p>
                <p className="text-gray-200">Restaurant Partners: <span className="text-white font-semibold">+91 98765 43211</span></p>
              </div>
              
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="text-2xl text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-amber-300">Email Us</h3>
                </div>
                <p className="text-gray-200 mb-2">General: <span className="text-white font-semibold">hello@foodmania.com</span></p>
                <p className="text-gray-200 mb-2">Support: <span className="text-white font-semibold">support@foodmania.com</span></p>
                <p className="text-gray-200">Partnerships: <span className="text-white font-semibold">partners@foodmania.com</span></p>
              </div>
              
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-2xl text-red-400 mr-3" />
                  <h3 className="text-xl font-bold text-amber-300">Visit Us</h3>
                </div>
                <p className="text-gray-200 mb-2">FoodMania Headquarters</p>
                <p className="text-white font-semibold mb-2">Tower A, 15th Floor</p>
                <p className="text-white font-semibold mb-2">Cyber City, Gurgaon</p>
                <p className="text-white font-semibold">Haryana 122002, India</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaClock className="text-2xl text-purple-400 mr-3" />
                  <h3 className="text-xl font-bold text-amber-300">Support Hours</h3>
                </div>
                <p className="text-gray-200 mb-2">Monday - Friday: <span className="text-white font-semibold">9:00 AM - 11:00 PM</span></p>
                <p className="text-gray-200 mb-2">Saturday - Sunday: <span className="text-white font-semibold">10:00 AM - 10:00 PM</span></p>
                <p className="text-amber-300 font-semibold">24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-main text-amber-300 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-amber-300 mb-2">How fast is delivery?</h4>
              <p className="text-gray-200 mb-4">Most orders arrive within 15-30 minutes. We use AI-powered routing to ensure the fastest delivery possible.</p>
              
              <h4 className="text-lg font-bold text-amber-300 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-200 mb-4">We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-amber-300 mb-2">How can restaurants partner with us?</h4>
              <p className="text-gray-200 mb-4">Email us at partners@foodmania.com or call +91 98765 43211. Our team will guide you through the onboarding process.</p>
              
              <h4 className="text-lg font-bold text-amber-300 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-200">Yes! If you're not satisfied with your order, contact us within 24 hours for a full refund or replacement.</p>
            </div>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="text-center bg-gradient-to-r from-amber-400/20 to-yellow-400/20 backdrop-blur-md rounded-3xl p-8 border border-amber-400/30">
          <h3 className="text-2xl font-main text-amber-300 mb-4">Follow Us</h3>
          <p className="text-gray-200 mb-6">Stay updated with the latest food trends, offers, and behind-the-scenes content!</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-3xl text-blue-400 hover:text-blue-300 transition-colors">
              <FaFacebook />
            </a>
            <a href="#" className="text-3xl text-pink-400 hover:text-pink-300 transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="text-3xl text-blue-300 hover:text-blue-200 transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="text-3xl text-blue-500 hover:text-blue-400 transition-colors">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Contact;
