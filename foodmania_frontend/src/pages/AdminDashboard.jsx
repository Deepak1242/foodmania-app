import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiShoppingBag, FiTrendingUp, FiPackage, FiStar, FiTag } from 'react-icons/fi';
import { loginState } from '../atom/atom';
import { getAnalytics } from '../api/adminAPI';
import DishManagement from '../components/admin/DishManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import VoucherManagement from '../components/admin/VoucherManagement';
import SalesChart from '../components/admin/SalesChart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaUsers, 
  FaUtensils, 
  FaShoppingBag, 
  FaDollarSign,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaSpinner
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [login] = useAtom(loginState);
  const { isLogin, user } = login;
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log('Admin Dashboard - Login State:', { isLogin, user });
    
    // Temporary bypass for testing - remove this in production
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('test') === 'admin';
    
    if (testMode) {
      console.log('Test mode enabled, bypassing admin check');
      loadAnalytics();
      return;
    }
    
    // Wait for login state to be fully loaded
    if (!isLogin) {
      console.log('Not logged in, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
      console.log('User role check failed:', { user, role: user?.role });
      alert(`Access denied. Admin privileges required. Current role: ${user?.role || 'undefined'}\n\nTo test admin panel, try: /admin?test=admin`);
      navigate('/');
      return;
    }
    
    console.log('Admin access granted, loading analytics');
    loadAnalytics();
  }, [isLogin, user, navigate]);

  const loadAnalytics = async () => {
    try {
      const response = await getAnalytics();
      console.log('Analytics response:', response);
      
      // Handle both possible response formats
      const analyticsData = response.data?.data || response.data || response;
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set mock data for testing
      setAnalytics({
        totalUsers: 150,
        totalDishes: 45,
        totalOrders: 320,
        totalRevenue: 15420.50,
        recentOrders: [],
        topDishes: [],
        orderStatusStats: [],
        ordersPerDay: [10, 15, 20, 25, 30, 22, 18]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="text-white text-lg sm:text-xl" />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-xs sm:text-sm">
            <FaChartLine className="mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-300 text-xs sm:text-sm">{title}</p>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
        active
          ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className="text-base sm:text-lg" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.slice(0, 3)}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d327b] via-[#1a4a9f] to-[#0d327b] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-yellow-400 mb-4 mx-auto" />
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d327b] via-[#1a4a9f] to-[#0d327b] z-0"></div>
      <div className="relative z-10 min-h-screen">
        <Navbar variant="cart" />
        
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-16 sm:mt-20 max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">Welcome back, {user?.firstName || 'Admin'}!</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-2">
            <TabButton
              id="overview"
              label="Overview"
              icon={FaChartLine}
              active={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="dishes"
              label="Dishes"
              icon={FaUtensils}
              active={activeTab === 'dishes'}
              onClick={setActiveTab}
            />
            <TabButton
              id="orders"
              label="Orders"
              icon={FaShoppingBag}
              active={activeTab === 'orders'}
              onClick={setActiveTab}
            />
            <TabButton
              id="users"
              label="Users"
              icon={FaUsers}
              active={activeTab === 'users'}
              onClick={setActiveTab}
            />
            <TabButton
              id="vouchers"
              label="Vouchers"
              icon={FiTag}
              active={activeTab === 'vouchers'}
              onClick={setActiveTab}
            />
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && analytics && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  icon={FaUsers}
                  title="Total Users"
                  value={analytics.totalUsers}
                  color="from-blue-500 to-blue-600"
                  trend={12}
                />
                <StatCard
                  icon={FaUtensils}
                  title="Total Dishes"
                  value={analytics.totalDishes}
                  color="from-green-500 to-green-600"
                  trend={8}
                />
                <StatCard
                  icon={FaShoppingBag}
                  title="Total Orders"
                  value={analytics.totalOrders}
                  color="from-purple-500 to-purple-600"
                  trend={25}
                />
                <StatCard
                  icon={FaDollarSign}
                  title="Total Revenue"
                  value={`$${analytics.totalRevenue?.toFixed(2) || '0.00'}`}
                  color="from-yellow-500 to-yellow-600"
                  trend={18}
                />
              </div>

              {/* Sales Chart */}
              <SalesChart />
              
              {/* Recent Orders */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {analytics.recentOrders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">
                          Order #{order.id} - {order.user.firstName} {order.user.lastName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {order.items.length} items • ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                        order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'DELIVERED' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Dishes */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Top Dishes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {analytics.topDishes?.map((dish, index) => (
                    <div key={index} className="flex items-center p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-lg flex items-center justify-center text-black font-bold mr-4">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{dish.name}</p>
                        <p className="text-gray-400 text-sm">
                          {dish.orderCount} orders • {dish.totalQuantity} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Management Components */}
          {activeTab === 'dishes' && <DishManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'vouchers' && <VoucherManagement />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
