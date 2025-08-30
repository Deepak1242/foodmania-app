import React from 'react';
import { FaCreditCard, FaTruck, FaClock, FaPercent, FaShieldAlt, FaLock } from 'react-icons/fa';

const OrderSummary = ({ 
  itemCount, 
  subtotal, 
  deliveryFee = 2.99, 
  taxRate = 0.08,
  onCheckout,
  onClearCart 
}) => {
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;
  const freeDeliveryThreshold = 25;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-fit sticky top-24 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCreditCard className="text-[#0d327b] text-2xl" />
        </div>
        <h2 className="text-3xl font-main text-yellow-400 mb-2">Order Summary</h2>
        <p className="text-gray-300 text-sm">Review your delicious selection</p>
      </div>

      {/* Free Delivery Banner */}
      {remainingForFreeDelivery > 0 && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FaTruck className="text-green-400" />
            <span className="text-green-300 font-semibold text-sm">Free Delivery Available!</span>
          </div>
          <p className="text-xs text-green-200">
            Add <span className="font-bold text-green-300">${remainingForFreeDelivery.toFixed(2)}</span> more for free delivery
          </p>
          <div className="w-full bg-green-900/30 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="space-y-5 mb-8">
        <div className="flex justify-between items-center text-lg">
          <div className="flex items-center gap-2">
            <span className="text-gray-200">Subtotal</span>
            <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">
              {itemCount} items
            </span>
          </div>
          <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-lg">
          <div className="flex items-center gap-2">
            <FaTruck className="text-blue-400" />
            <span className="text-gray-200">Delivery Fee</span>
            {subtotal >= freeDeliveryThreshold && (
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">FREE</span>
            )}
          </div>
          <span className="font-bold text-white">
            {subtotal >= freeDeliveryThreshold ? (
              <span className="line-through text-gray-400">${deliveryFee.toFixed(2)}</span>
            ) : (
              `$${deliveryFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-lg">
          <div className="flex items-center gap-2">
            <FaPercent className="text-purple-400" />
            <span className="text-gray-200">Tax ({(taxRate * 100).toFixed(0)}%)</span>
          </div>
          <span className="font-bold text-white">${tax.toFixed(2)}</span>
        </div>


        {/* Total */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex justify-between items-center font-bold text-2xl mb-2">
            <span className="text-yellow-400">Total</span>
            <span className="text-yellow-400">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-right">
            Including all taxes and fees
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Delivery Information</span>
        </div>
        <div className="space-y-1 text-xs text-blue-200">
          <p>⏰ Estimated delivery: 25-35 mins</p>
          <p>📍 Delivering to your location</p>
          <p>🔥 Your food will be hot and fresh!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0d327b] font-bold py-4 rounded-xl hover:from-yellow-300 hover:to-amber-300 transition-all transform hover:scale-105 active:scale-95 text-lg shadow-lg"
        >
          🚀 Proceed to Checkout
        </button>
        
        <button
          onClick={onClearCart}
          className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition-all text-sm"
        >
          Clear Cart
        </button>
      </div>

      {/* Security Badge */}
      <div className="text-center mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span>Secure checkout with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
