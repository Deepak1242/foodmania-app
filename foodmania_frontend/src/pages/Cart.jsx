import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { cartState, cartTotals } from '../atom/atom';
import { useCartSync } from '../hooks/useCartSync';
import { FaMinus, FaPlus, FaTrash, FaStar, FaShoppingCart, FaClock, FaLeaf } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { cartAPI } from '../api/api';
import OrderSummary from '../components/OrderSummary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const [localCart, setLocalCart] = useAtom(cartState);
  const { itemCount, totalPrice } = useAtomValue(cartTotals);
  const { syncCartWithBackend } = useCartSync();
  const navigate = useNavigate();

  // Sync cart when component mounts
  useEffect(() => {
    syncCartWithBackend();
  }, []);
  // Debounced sync utilities for smooth interactions
  const timersRef = useRef({});
  const cartRef = useRef(localCart);
  useEffect(() => { cartRef.current = localCart; }, [localCart]);
  useEffect(() => () => {
    Object.values(timersRef.current || {}).forEach((t) => clearTimeout(t));
  }, []);

  const scheduleSync = (itemId, delay = 200) => {
    if (timersRef.current[itemId]) clearTimeout(timersRef.current[itemId]);
    timersRef.current[itemId] = setTimeout(async () => {
      try {
        const curr = cartRef.current;
        const item = curr.find((i) => i.id === itemId);
        const desired = item ? item.quantity : 0;

        if (desired <= 0) {
          try {
            await cartAPI.removeFromCart(itemId);
          } catch (e) {
            if (e?.response?.status !== 404) throw e;
          }
        } else {
          await cartAPI.updateCart(itemId, { quantity: desired });
        }
      } catch (e) {
        console.error('Sync error (itemId:', itemId, '):', e);
        try {
          const resp = await cartAPI.getCart();
          setLocalCart(resp.data?.data?.items || []);
        } catch {}
      }
    }, delay);
  };

  // Load cart on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await cartAPI.getCart();
        setLocalCart(response.data?.data?.items || []);
      } catch (err) {
        console.error("Error loading cart:", err);
        setLocalCart([]);
      }
    };

    loadCart();
  }, [setLocalCart]);

  // Update cart item quantity
  const updateQuantity = (itemId, newQuantity) => {
    // Optimistic update
    setLocalCart((curr) => {
      if (newQuantity === 0) return curr.filter((i) => i.id !== itemId);
      return curr.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i));
    });
    // Debounced backend sync
    scheduleSync(itemId);
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    // Optimistic remove
    setLocalCart((curr) => curr.filter((i) => i.id !== itemId));
    // Debounced backend sync (will perform remove)
    scheduleSync(itemId);
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    const prev = localCart;
    setLocalCart([]);
    try {
      await cartAPI.clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
      setLocalCart(prev);
      try {
        const response = await cartAPI.getCart();
        setLocalCart(response.data?.data?.items || []);
      } catch {}
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d327b] via-[#1a4a9f] to-[#0d327b] z-0"></div>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-20 max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Shopping Cart
          </span>
          <span className="text-gray-300 text-lg ml-3">({itemCount} items)</span>
        </h1>
        
        {localCart.length === 0 ? (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-16 text-center">
            <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-white text-2xl mb-2">Your cart is empty</p>
            <p className="text-gray-400 mb-6">Add some delicious items to get started!</p>
            <button 
              onClick={() => navigate('/dishes')}
              className="bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0d327b] font-bold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-amber-300 transition-all transform hover:scale-105"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FaShoppingCart className="text-yellow-400" />
                  Cart Items
                </h2>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {localCart.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-4 hover:from-white/10 hover:to-white/15 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <img 
                            src={item.dish?.image || `https://source.unsplash.com/150x150/?${item.dish?.name}`}
                            alt={item.dish?.name}
                            className="w-28 h-28 object-cover rounded-xl"
                          />
                          <div className="absolute -top-2 -right-2 bg-yellow-400 text-[#0d327b] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{item.dish?.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400" size={10} />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-400">(4.5)</span>
                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Fresh</span>
                              </div>
                              <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.dish?.description}</p>
                            </div>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 border border-yellow-400/50 rounded-xl p-1">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-all text-white active:scale-95"
                              >
                                {item.quantity === 1 ? <FaTrash size={12} /> : <FaMinus size={12} />}
                              </button>
                              <span className="font-bold text-yellow-400 px-3 min-w-[40px] text-center text-lg">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-green-500/30 hover:bg-green-500/50 rounded-lg transition-all text-white active:scale-95"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-yellow-400">
                                ${((item.dish?.price || 0) * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${item.dish?.price || 0} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                  <button 
                    onClick={() => navigate('/dishes')}
                    className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <span>←</span> Continue Shopping
                  </button>
                  <button 
                    onClick={handleClearCart}
                    className="text-red-400 hover:bg-red-500/10 py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                  >
                    <FaTrash size={14} /> Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary 
                  subtotal={parseFloat(totalPrice)}
                  itemCount={itemCount}
                  onClearCart={handleClearCart}
                  onCheckout={() => {
                    // Navigate to checkout page
                    navigate('/checkout');
                  }}
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
