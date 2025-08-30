import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { cartState, loginState } from '../atom/atom';
import { FaCheckCircle, FaSpinner, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cart, setCart] = useAtom(cartState);
  const [login] = useAtom(loginState);
  const [loading, setLoading] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState(false);

  useEffect(() => {
    if (!login.isLogin) {
      navigate('/login');
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (sessionId && !orderProcessed) {
      // Clear cart from state
      setCart([]);
      // Dispatch custom event for immediate sync
      window.dispatchEvent(new Event('cart-cleared'));
      setOrderProcessed(true);
    }
    
    // Set loading to false after a brief delay to show success animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [login.isLogin, navigate, searchParams, setCart, orderProcessed]);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/dishes');
  };

  if (loading) {
    return (
      <>
        <Navbar variant="cart" />
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-20 pb-10 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-6xl text-yellow-400 mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing Your Order</h2>
            <p className="text-gray-300">Please wait while we confirm your payment...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar variant="cart" />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-25 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Order Placed Successfully!
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-2">
              Thank you for your order! 🎉
            </p>
            
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Your payment has been processed successfully and your order is being prepared. 
              You'll receive updates about your order status via email and you can track it in your orders page.
            </p>

            {/* Order Details Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Order confirmation sent to your email</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Kitchen will start preparing your food</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Estimated delivery: 30-45 minutes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Track your order in real-time</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleViewOrders}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all transform hover:scale-105"
              >
                <FaShoppingBag />
                View My Orders
                <FaArrowRight />
              </button>
              
              <button
                onClick={handleContinueShopping}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/10 text-white font-semibold rounded-xl hover:from-white/15 hover:to-white/10 transition-all"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-blue-500/10 border border-blue-400/20 rounded-xl max-w-2xl mx-auto">
              <h4 className="text-blue-300 font-semibold mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm">
                If you have any questions about your order, please contact our support team or 
                check your order status in the orders section.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
