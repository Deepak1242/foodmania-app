import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTruck, FaClock, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { MdDeliveryDining, MdRestaurant } from 'react-icons/md';
import checkoutAPI from '../api/checkoutAPI';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeliveryTracking = ({ activeDeliveries = [] }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // San Francisco default

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-500';
      case 'PREPARING':
        return 'bg-yellow-500';
      case 'OUT_FOR_DELIVERY':
        return 'bg-green-500';
      case 'DELIVERED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <FaCheckCircle />;
      case 'PREPARING':
        return <MdRestaurant />;
      case 'OUT_FOR_DELIVERY':
        return <FaTruck />;
      case 'DELIVERED':
        return <FaCheckCircle />;
      default:
        return <FaClock />;
    }
  };

  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const response = await checkoutAPI.updateDeliveryStatus(orderId, {
        status: newStatus,
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.1,
          lng: -122.4194 + (Math.random() - 0.5) * 0.1
        }
      });
      
      if (response.success) {
        alert(`Order #${orderId} status updated to ${newStatus}`);
        // Refresh the page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Deliveries Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4">Active Deliveries</h3>
          {activeDeliveries.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
              <MdDeliveryDining className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300">No active deliveries at the moment</p>
            </div>
          ) : (
            activeDeliveries.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedDelivery(order)}
                className={`bg-white/10 border rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20 ${
                  selectedDelivery?.id === order.id ? 'border-yellow-400' : 'border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold">Order #{order.id}</p>
                    <p className="text-gray-400 text-sm">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span>{order.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaMapMarkerAlt className="text-yellow-400" />
                    <span>{order.deliveryAddress || 'Address not provided'}</span>
                  </div>
                  
                  {order.deliveryPersonName && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaUser className="text-blue-400" />
                      <span>{order.deliveryPersonName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-300">
                    <FaClock className="text-green-400" />
                    <span>Est. {order.estimatedDeliveryTime ? 
                      new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '30-45 mins'}</span>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="mt-4 flex gap-2">
                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeliveryStatus(order.id, 'PREPARING');
                      }}
                      className="flex-1 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all text-sm font-semibold"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeliveryStatus(order.id, 'OUT_FOR_DELIVERY');
                      }}
                      className="flex-1 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm font-semibold"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeliveryStatus(order.id, 'DELIVERED');
                      }}
                      className="flex-1 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map View */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-4">Delivery Map</h3>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MapContainer 
              center={mapCenter} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Show markers for all active deliveries */}
              {activeDeliveries.map((order) => {
                // Generate random positions for demo
                const lat = 37.7749 + (Math.random() - 0.5) * 0.1;
                const lng = -122.4194 + (Math.random() - 0.5) * 0.1;
                
                return (
                  <Marker 
                    key={order.id}
                    position={[lat, lng]}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Order #{order.id}</strong><br />
                        {order.user?.firstName} {order.user?.lastName}<br />
                        Status: {order.status.replace(/_/g, ' ')}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Selected Delivery Details */}
      {selectedDelivery && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Order Details - #{selectedDelivery.id}</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">Customer Information</h4>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="text-gray-400">Name:</span> {selectedDelivery.user?.firstName} {selectedDelivery.user?.lastName}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Email:</span> {selectedDelivery.user?.email}
                </p>
                {selectedDelivery.user?.phone && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Phone:</span> {selectedDelivery.user.phone}
                  </p>
                )}
                <p className="text-gray-300">
                  <span className="text-gray-400">Address:</span> {selectedDelivery.deliveryAddress || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">Order Items</h4>
              <div className="space-y-2">
                {selectedDelivery.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-300">
                    <span>{item.quantity}x {item.dish?.name}</span>
                    <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span className="text-yellow-400">${selectedDelivery.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {selectedDelivery.user?.phone && (
              <button className="flex-1 py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all font-semibold flex items-center justify-center gap-2">
                <FaPhone />
                Call Customer
              </button>
            )}
            {selectedDelivery.deliveryPersonPhone && (
              <button className="flex-1 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/30 transition-all font-semibold flex items-center justify-center gap-2">
                <FaPhone />
                Call Driver
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
