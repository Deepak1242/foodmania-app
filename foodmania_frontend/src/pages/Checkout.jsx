import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { loadStripe } from '@stripe/stripe-js';
import { cartState, loginState } from '../atom/atom';
import { FaCreditCard, FaShieldAlt, FaLock, FaTruck, FaTag, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { MdLocalOffer, MdLocationOn } from 'react-icons/md';
import checkoutAPI from '../api/checkoutAPI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Stripe public key (test key)
const stripePromise = loadStripe('pk_test_51QUtA1K0G96hgFg3OwELzFiHsGQsWzVCJPsGLzYAI8HhvL7HRRKxdHBY3jSAy92YXFrFXyAJ7BSNvRdkxQvPbFRR00mDzq5fZe');

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useAtom(cartState);
  const [login] = useAtom(loginState);
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [demoMode, setDemoMode] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  useEffect(() => {
    if (!login.isLogin) {
      navigate('/login');
      return;
    }
    // Don't redirect if checkout was just completed
    if (!checkoutCompleted && (!cart || cart.length === 0)) {
      navigate('/dishes');
    }
  }, [login.isLogin, cart, navigate, checkoutCompleted]);

  const calculateSubtotal = () => {
    return cart?.reduce(
      (total, item) => total + (((item.dish?.price || item.price || 0)) * item.quantity),
      0
    ) || 0;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal - discount + tax + deliveryFee;

  const applyVoucher = async () => {
    if (!voucherCode) return;
    
    try {
      // For demo purposes, accept any code that starts with "DEMO"
      if (voucherCode.toUpperCase().startsWith('DEMO')) {
        setDiscount(subtotal * 0.15); // 15% discount
        setVoucherApplied(true);
        alert('Demo voucher applied! 15% discount');
      } else {
        // TODO: Validate voucher with backend
        setVoucherApplied(false);
        alert('Invalid voucher code');
      }
    } catch (error) {
      console.error('Error applying voucher:', error);
      alert('Failed to apply voucher');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (isDemo = false) => {
    setLoading(true);
    
    try {
      const addressString = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`;
      
      const response = await checkoutAPI.createCheckoutSession({
        voucherCode: voucherApplied ? voucherCode : '',
        deliveryAddress: addressString,
        isDemo: isDemo
      });

      if (response.success) {
        // Mark checkout as completed to prevent redirect
        setCheckoutCompleted(true);
        
        // Clear cart immediately for better UX
        setCart([]);
        localStorage.removeItem('cartState');
        // Dispatch custom event for immediate sync
        window.dispatchEvent(new Event('cart-cleared'));
        
        if (isDemo) {
          // Demo payment successful - redirect to orders
          navigate('/orders');
        } else {
          // Redirect to Stripe checkout
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.sessionId,
          });
          
          if (error) {
            console.error('Stripe redirect error:', error);
            alert('Failed to redirect to payment page');
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar variant="cart" />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Secure Checkout
            </span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Delivery & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MdLocationOn className="mr-2 text-yellow-400" />
                  Delivery Address
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={deliveryAddress.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 md:col-span-2"
                  />
                </div>
              </div>

              {/* Voucher Code */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaTag className="mr-2 text-yellow-400" />
                  Promo Code
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter promo code (try DEMO20)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={applyVoucher}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {voucherApplied && (
                  <p className="mt-2 text-green-400 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Voucher applied successfully!
                  </p>
                )}
              </div>

              {/* Payment Options */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-yellow-400" />
                  Payment Method
                </h2>
                
                {/* Demo Mode Toggle */}
                <div className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={demoMode}
                      onChange={(e) => setDemoMode(e.target.checked)}
                      className="mr-3 w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                    />
                    <div>
                      <p className="text-white font-semibold">Portfolio Demo Mode</p>
                      <p className="text-gray-300 text-sm">Test the checkout without real payment</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  {demoMode ? (
                    <button
                      onClick={() => handleCheckout(true)}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Processing Demo Order...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Place Demo Order (No Payment)
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(false)}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock />
                          Pay with Stripe
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Security Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-400" />
                    <span className="text-sm">SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLock className="text-blue-400" />
                    <span className="text-sm">PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart?.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-300">
                      <div>
                        <p className="text-white">{item.dish?.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white">${(((item.dish?.price || item.price || 0) * item.quantity)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-yellow-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400">
                    <FaTruck />
                    <span className="text-sm">Estimated delivery: 30-45 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
