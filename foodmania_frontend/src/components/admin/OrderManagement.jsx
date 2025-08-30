import { useState, useEffect } from 'react';
import adminAPI from '../../api/adminAPI';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTimes,
  FaClock,
  FaTruck
} from 'react-icons/fa';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        search: searchTerm
      };
      const response = await adminAPI.getAllOrders(currentPage, 10, searchTerm, statusFilter);
      console.log('Orders response:', response);
      setOrders(response.data?.data?.orders || []);
      setPagination(response.data?.data?.pagination || {});
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, paymentStatus = null) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus, paymentStatus);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, paymentStatus: paymentStatus || selectedOrder.paymentStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/20 text-green-300';
      case 'PREPARING': return 'bg-yellow-500/20 text-yellow-300';
      case 'OUT_FOR_DELIVERY': return 'bg-blue-500/20 text-blue-300';
      case 'DELIVERED': return 'bg-emerald-500/20 text-emerald-300';
      case 'CANCELLED': return 'bg-red-500/20 text-red-300';
      case 'PENDING': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <FaCheck />;
      case 'PREPARING': return <FaClock />;
      case 'OUT_FOR_DELIVERY': return <FaTruck />;
      case 'DELIVERED': return <FaCheck />;
      case 'CANCELLED': return <FaTimes />;
      case 'PENDING': return <FaClock />;
      default: return <FaClock />;
    }
  };

  const StatusButton = ({ status, currentStatus, onClick, color, icon }) => (
    <button
      onClick={() => onClick(status)}
      disabled={currentStatus === status}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        currentStatus === status 
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
          : `${color} hover:opacity-80`
      }`}
    >
      {icon} {status}
    </button>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Order Management</h2>
        <div className="text-gray-300">
          Total Orders: {pagination.total || 0}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
        
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">Order ID</th>
                <th className="px-6 py-4 text-left text-white font-medium">Customer</th>
                <th className="px-6 py-4 text-left text-white font-medium">Items</th>
                <th className="px-6 py-4 text-left text-white font-medium">Total</th>
                <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white font-medium">Date</th>
                <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{order.items.length} items</td>
                  <td className="px-6 py-4 text-white font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft /> Previous
          </button>
          
          <span className="px-4 py-2 text-white">
            Page {currentPage} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Order Details #{selectedOrder.id}</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-medium mb-2">Customer Information</h4>
                <p className="text-gray-300">
                  {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                </p>
                <p className="text-gray-400 text-sm">{selectedOrder.user.email}</p>
                <p className="text-gray-400 text-sm mt-2">
                  <strong>Address:</strong> {selectedOrder.address}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-medium mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.dish.image && (
                          <img 
                            src={item.dish.image} 
                            alt={item.dish.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{item.dish.name}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-medium">
                        ${(item.dish.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-xl font-bold text-yellow-400">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-medium mb-4">Order Status</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <StatusButton
                    status="CONFIRMED"
                    currentStatus={selectedOrder.status}
                    onClick={(status) => handleStatusUpdate(selectedOrder.id, status)}
                    color="bg-green-500/20 text-green-300"
                    icon={<FaCheck />}
                  />
                  <StatusButton
                    status="PREPARING"
                    currentStatus={selectedOrder.status}
                    onClick={(status) => handleStatusUpdate(selectedOrder.id, status)}
                    color="bg-yellow-500/20 text-yellow-300"
                    icon={<FaClock />}
                  />
                  <StatusButton
                    status="OUT_FOR_DELIVERY"
                    currentStatus={selectedOrder.status}
                    onClick={(status) => handleStatusUpdate(selectedOrder.id, status)}
                    color="bg-blue-500/20 text-blue-300"
                    icon={<FaTruck />}
                  />
                  <StatusButton
                    status="DELIVERED"
                    currentStatus={selectedOrder.status}
                    onClick={(status) => handleStatusUpdate(selectedOrder.id, status)}
                    color="bg-emerald-500/20 text-emerald-300"
                    icon={<FaCheck />}
                  />
                  <StatusButton
                    status="CANCELLED"
                    currentStatus={selectedOrder.status}
                    onClick={(status) => handleStatusUpdate(selectedOrder.id, status)}
                    color="bg-red-500/20 text-red-300"
                    icon={<FaTimes />}
                  />
                </div>
                
                <div className="text-sm text-gray-400">
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                  <p><strong>Payment ID:</strong> {selectedOrder.paymentId}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
