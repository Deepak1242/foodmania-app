import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaCheckCircle, FaClock, FaTruck, FaHome, FaPhone, FaUser, FaSpinner } from 'react-icons/fa';
import { MdRestaurant, MdDeliveryDining } from 'react-icons/md';
import checkoutAPI from '../api/checkoutAPI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for map markers
const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const homeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState([37.7749, -122.4194]); // San Francisco default
  const [restaurantLocation] = useState([37.7849, -122.4094]); // Restaurant location
  const [customerLocation] = useState([37.7649, -122.4294]); // Customer location
  const [trackingStatus, setTrackingStatus] = useState('CONFIRMED');

  useEffect(() => {
    fetchOrderDetails();
    // Simulate delivery movement
    const interval = setInterval(() => {
      simulateDeliveryMovement();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await checkoutAPI.getOrderDetails(orderId);
      if (response.success) {
        setOrder(response.order);
        setTrackingStatus(response.order.status);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      // For demo, create a mock order
      setOrder({
        id: orderId,
        status: 'CONFIRMED',
        total: 45.99,
        items: [
          { dish: { name: 'Burger Deluxe' }, quantity: 2 },
          { dish: { name: 'French Fries' }, quantity: 1 }
        ],
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
        deliveryAddress: '123 Main St, San Francisco, CA 94102',
        deliveryPersonName: 'John Driver',
        deliveryPersonPhone: '+1 (555) 123-4567'
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateDeliveryMovement = () => {
    setDeliveryLocation(prev => {
      const [lat, lng] = prev;
      const latDiff = (customerLocation[0] - restaurantLocation[0]) / 10;
      const lngDiff = (customerLocation[1] - restaurantLocation[1]) / 10;
      const newLat = lat + latDiff + (Math.random() - 0.5) * 0.001;
      const newLng = lng + lngDiff + (Math.random() - 0.5) * 0.001;
      
      // Update tracking status based on position
      const distance = Math.sqrt(
        Math.pow(newLat - customerLocation[0], 2) + 
        Math.pow(newLng - customerLocation[1], 2)
      );
      
      if (distance < 0.005) {
        setTrackingStatus('DELIVERED');
      } else if (distance < 0.02) {
        setTrackingStatus('OUT_FOR_DELIVERY');
      } else {
        setTrackingStatus('PREPARING');
      }
      
      return [newLat, newLng];
    });
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
        return <FaHome className="text-green-400" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Order Confirmed';
      case 'PREPARING':
        return 'Preparing Your Food';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered';
      default:
        return 'Processing';
    }
  };

  const trackingSteps = [
    { status: 'CONFIRMED', label: 'Order Confirmed', time: '2 mins ago' },
    { status: 'PREPARING', label: 'Preparing', time: trackingStatus === 'CONFIRMED' ? 'Soon' : '5 mins ago' },
    { status: 'OUT_FOR_DELIVERY', label: 'On the Way', time: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(trackingStatus) ? '10 mins ago' : 'Pending' },
    { status: 'DELIVERED', label: 'Delivered', time: trackingStatus === 'DELIVERED' ? 'Just now' : 'Pending' }
  ];

  const isStepActive = (stepStatus) => {
    const statusOrder = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(trackingStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-yellow-400" />
      </div>
    );
  }

  return (
    <>
      <Navbar variant="cart" />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Track Your Order
              </span>
            </h1>
            <p className="text-gray-300">Order #{orderId}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Status */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{getStatusIcon(trackingStatus)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{getStatusText(trackingStatus)}</h2>
                    <p className="text-gray-400 text-sm">
                      Est. delivery: {order?.estimatedDeliveryTime ? 
                        new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : '30-45 mins'}
                    </p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isStepActive(step.status) 
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-400' 
                          : 'bg-gray-700'
                      }`}>
                        {isStepActive(step.status) ? 
                          <FaCheckCircle className="text-black" /> : 
                          <span className="text-gray-400">{index + 1}</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          isStepActive(step.status) ? 'text-white' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Person */}
              {['OUT_FOR_DELIVERY', 'DELIVERED'].includes(trackingStatus) && (
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <MdDeliveryDining className="mr-2 text-yellow-400" />
                    Delivery Partner
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-gray-400" />
                      <span className="text-white">{order?.deliveryPersonName || 'John Driver'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400" />
                      <span className="text-white">{order?.deliveryPersonPhone || '+1 (555) 123-4567'}</span>
                    </div>
                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all">
                      Call Driver
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-300">
                      <span>{item.quantity}x {item.dish?.name}</span>
                      <span>${((item.price || 10) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between text-white font-bold">
                      <span>Total</span>
                      <span className="text-yellow-400">${order?.total?.toFixed(2) || '45.99'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-[600px]">
                <h3 className="text-lg font-bold text-white mb-4">Live Tracking</h3>
                <div className="h-[520px] rounded-xl overflow-hidden">
                  <MapContainer 
                    center={deliveryLocation} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Restaurant Marker */}
                    <Marker position={restaurantLocation} icon={restaurantIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Restaurant</strong><br />
                          Preparing your order
                        </div>
                      </Popup>
                    </Marker>

                    {/* Delivery Person Marker */}
                    <Marker position={deliveryLocation} icon={deliveryIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Delivery Partner</strong><br />
                          {order?.deliveryPersonName || 'John Driver'}
                        </div>
                      </Popup>
                    </Marker>

                    {/* Customer Marker */}
                    <Marker position={customerLocation} icon={homeIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Your Location</strong><br />
                          {order?.deliveryAddress || '123 Main St'}
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Line */}
                    <Polyline 
                      positions={[restaurantLocation, deliveryLocation, customerLocation]} 
                      color="blue" 
                      weight={3}
                      opacity={0.7}
                      dashArray="10, 10"
                    />
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate('/dishes')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all"
            >
              Order Again
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderTracking;
