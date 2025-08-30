import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/welcomePage';
import Login from './pages/login';
import Signup from './pages/signup';
import Dishes from './pages/dishes';
import Cart from './pages/Cart';
import About from './pages/about';
import Contact from './pages/contact';
import NotFound from './pages/notFound';
import ProtectedRoute from './components/protectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TestPage from './pages/test';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import UserOrders from './pages/UserOrders';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dishes" element={<Dishes />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
