import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { loginState } from '../atom/atom';
import checkoutAPI from '../api/checkoutAPI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaHome,
  FaSpinner,
  FaEye,
  FaCalendarAlt,
  FaDollarSign,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';

const UserOrders = () => {
  const navigate = useNavigate();
  const [login] = useAtom(loginState);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!login.isLogin) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [login.isLogin, navigate]);

  const loadOrders = async () => {
    try {
      const response = await checkoutAPI.getUserOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        // Handle case where response doesn't have success flag (backward compatibility)
        setOrders(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <FaCheckCircle className="text-green-400" />;
      case 'PREPARING':
        return <MdRestaurant className="text-yellow-400" />;
      case 'OUT_FOR_DELIVERY':
        return <FaTruck className="text-blue-400" />;
      case 'DELIVERED':
        return <FaHome className="text-emerald-400" />;
      case 'CANCELLED':
        return <FaClock className="text-red-400" />;
      case 'PENDING':
        return <FaClock className="text-orange-400" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'PREPARING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'DELIVERED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'PENDING':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-green-500/20 text-green-300';
      case 'DEMO':
        return 'bg-purple-500/20 text-purple-300';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar variant="cart" />
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-20 pb-10 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-yellow-400 mb-4 mx-auto" />
            <p className="text-white text-lg">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar variant="cart" />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                My Orders
              </span>
            </h1>
            <p className="text-gray-300">Track and view all your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <FaShoppingBag className="text-6xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400 mb-6">You haven't placed any orders yet. Start exploring our delicious dishes!</p>
              <button
                onClick={() => navigate('/dishes')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all"
              >
                Browse Dishes
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-1">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <p key={index} className="text-gray-300 text-sm">
                            {item.quantity}x {item.dish?.name || 'Unknown Item'}
                          </p>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-gray-400 text-xs">+{order.items.length - 3} more items</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">Delivery</h4>
                      <div className="space-y-1">
                        {order.deliveryAddress && (
                          <p className="text-gray-300 text-sm flex items-start gap-1">
                            <FaMapMarkerAlt className="text-yellow-400 mt-1 text-xs" />
                            <span className="line-clamp-2">{order.deliveryAddress}</span>
                          </p>
                        )}
                        {order.estimatedDeliveryTime && (
                          <p className="text-gray-400 text-xs">
                            Est. delivery: {formatDate(order.estimatedDeliveryTime)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">Total</h4>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                          <FaDollarSign className="text-lg" />
                          {order.total?.toFixed(2) || '0.00'}
                        </p>
                        {order.paymentMethod && (
                          <p className="text-gray-400 text-xs">
                            via {order.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Active Orders */}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'PENDING' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs">Order Progress</span>
                        <span className="text-gray-400 text-xs">
                          {order.status === 'CONFIRMED' ? '25%' :
                           order.status === 'PREPARING' ? '50%' :
                           order.status === 'OUT_FOR_DELIVERY' ? '75%' : '100%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-amber-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: order.status === 'CONFIRMED' ? '25%' :
                                   order.status === 'PREPARING' ? '50%' :
                                   order.status === 'OUT_FOR_DELIVERY' ? '75%' : '100%'
                          }}
                        ></div>
                      </div>
                      
                      {/* Order Status Steps */}
                      <div className="mt-3 flex justify-between text-xs">
                        <div className={`flex flex-col items-center ${order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'OUT_FOR_DELIVERY' ? 'text-yellow-400' : 'text-gray-500'}`}>
                          <FaCheckCircle className="mb-1" />
                          <span>Confirmed</span>
                        </div>
                        <div className={`flex flex-col items-center ${order.status === 'PREPARING' || order.status === 'OUT_FOR_DELIVERY' ? 'text-yellow-400' : 'text-gray-500'}`}>
                          <MdRestaurant className="mb-1" />
                          <span>Preparing</span>
                        </div>
                        <div className={`flex flex-col items-center ${order.status === 'OUT_FOR_DELIVERY' ? 'text-blue-400' : 'text-gray-500'}`}>
                          <FaTruck className="mb-1" />
                          <span>On the way</span>
                        </div>
                        <div className={`flex flex-col items-center ${order.status === 'DELIVERED' ? 'text-emerald-400' : 'text-gray-500'}`}>
                          <FaHome className="mb-1" />
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special message for pending orders */}
                  {order.status === 'PENDING' && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-400/20 rounded-lg">
                      <p className="text-orange-300 text-sm flex items-center gap-2">
                        <FaClock />
                        Order is being processed. You'll receive confirmation shortly.
                      </p>
                    </div>
                  )}

                  {/* Special message for cancelled orders */}
                  {order.status === 'CANCELLED' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                      <p className="text-red-300 text-sm flex items-center gap-2">
                        <FaClock />
                        This order has been cancelled. Contact support if you have questions.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrders;
