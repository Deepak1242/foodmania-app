import { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { cartState, cartTotals } from "../atom/atom";
import { dishesAPI, cartAPI } from "../api/api";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaSpinner, FaPlus, FaMinus, FaTrash, FaShoppingCart, FaStar } from "react-icons/fa";

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCart, setLocalCart] = useAtom(cartState);
  const { itemCount, totalPrice } = useAtomValue(cartTotals);
  // Debounce helpers for smooth syncing
  const timersRef = useRef({});
  const retriesRef = useRef({});
  const cartRef = useRef(localCart);
  const lastKnownItemIdRef = useRef({});
  useEffect(() => { cartRef.current = localCart; }, [localCart]);
  useEffect(() => () => {
    Object.values(timersRef.current || {}).forEach((t) => clearTimeout(t));
  }, []);

  const scheduleSync = (dishId, delay = 250) => {
    if (timersRef.current[dishId]) {
      clearTimeout(timersRef.current[dishId]);
    }
    timersRef.current[dishId] = setTimeout(async () => {
      try {
        const currCart = cartRef.current;
        const item = currCart.find((i) => i.dish?.id === dishId);
        const desired = item ? item.quantity : 0;

        // Track last known real cart item id for this dish
        if (item && typeof item.id !== 'string') {
          lastKnownItemIdRef.current[dishId] = item.id;
        }

        // Nothing to do if item absent and desired 0
        if (!item && desired === 0) {
          const lastId = lastKnownItemIdRef.current[dishId];
          if (lastId) {
            await cartAPI.removeFromCart(lastId);
            lastKnownItemIdRef.current[dishId] = undefined;
          }
          return;
        }

        // Wait for real ID if it's still temporary
        if (!item || typeof item.id === 'string') {
          const attempts = (retriesRef.current[dishId] || 0) + 1;
          if (attempts <= 10) {
            retriesRef.current[dishId] = attempts;
            scheduleSync(dishId, 150);
          }
          return;
        }

        if (desired <= 0) {
          await cartAPI.removeFromCart(item.id);
        } else {
          await cartAPI.updateCart(item.id, { quantity: desired });
        }
      } catch (e) {
        console.error('Sync error (dishId:', dishId, '):', e);
        try {
          const resp = await cartAPI.getCart();
          setLocalCart(resp.data?.data?.items || []);
        } catch {}
      } finally {
        retriesRef.current[dishId] = 0;
      }
    }, delay);
  };

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const response = await dishesAPI.getAll();
        const data = response.data || [];
        setDishes(data);
      } catch (err) {
        console.error('Error loading dishes:', err);
        setError('Failed to load dishes');
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  // Load cart from backend when component mounts and sync with global state
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await cartAPI.getCart();
        const serverCart = response.data?.data?.items || [];
        setLocalCart(serverCart);
      } catch (err) {
        console.error('Error loading cart:', err);
        // If server fails, keep local state but don't override with empty array
        if (localCart.length === 0) {
          setLocalCart([]);
        }
      }
    };

    loadCart();
  }, []);

  // Watch for cart state changes from localStorage (cross-tab and cross-component sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartState') {
        try {
          const newCart = JSON.parse(e.newValue || '[]');
          // Always sync when cart is cleared (empty array)
          if (newCart.length === 0 && localCart.length > 0) {
            setLocalCart([]);
            // Clear any pending syncs
            Object.keys(timersRef.current).forEach(key => {
              clearTimeout(timersRef.current[key]);
              delete timersRef.current[key];
            });
          } else if (JSON.stringify(newCart) !== JSON.stringify(localCart)) {
            setLocalCart(newCart);
          }
        } catch (error) {
          console.error('Error parsing cart from storage:', error);
        }
      }
    };

    // Listen to both storage events and custom cart-cleared events
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for immediate cart clearing within same tab
    const handleCartCleared = () => {
      setLocalCart([]);
      // Clear any pending syncs
      Object.keys(timersRef.current).forEach(key => {
        clearTimeout(timersRef.current[key]);
        delete timersRef.current[key];
      });
    };
    window.addEventListener('cart-cleared', handleCartCleared);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-cleared', handleCartCleared);
    };
  }, [localCart, setLocalCart]);

  const handleAddToCart = async (dish) => {
    const prevCart = localCart; // Store current cart state for potential rollback
    try {
      const dishId = dish.id || dish._id;

      if (!dishId) {
        console.error('Invalid dish data:', dish);
        alert('Invalid dish data. Please refresh the page and try again.');
        return;
      }

      // Optimistic update
      const existing = prevCart.find((i) => i.dish?.id === dish.id);
      let optimisticCart;
      if (existing) {
        optimisticCart = prevCart.map((i) =>
          i.dish?.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        optimisticCart = [
          ...prevCart,
          { id: `temp-${dish.id}`, dish, quantity: 1 },
        ];
      }
      setLocalCart(optimisticCart);

      console.log('Adding to cart:', { dishId, dishName: dish.name });
      const response = await cartAPI.addToCart({ dishId: parseInt(dishId), quantity: 1 });
      const item = response.data?.data;

      // Reconcile with server response
      if (item && item.dish) {
        setLocalCart((curr) => {
          const found = curr.find((i) => i.dish?.id === item.dish.id);
          if (!found) return curr; // unlikely
          return curr.map((i) =>
            i.dish?.id === item.dish.id
              ? { ...i, id: item.id, quantity: item.quantity, dish: item.dish }
              : i
          );
        });
        // store last known id and sync to latest desired
        lastKnownItemIdRef.current[item.dish.id] = item.id;
        // Ensure server matches latest desired quantity after reconciliation
        scheduleSync(item.dish.id, 100);
      }
    } catch (err) {
      console.error("Error adding to cart:", err.response || err);
      
      if (err.response?.status === 401) {
        alert('Please log in to add items to cart.');
        window.location.href = '/login';
      } else if (err.response?.data?.message) {
        alert(`Failed to add item: ${err.response.data.message}`);
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
      // Revert optimistic change fully
      setLocalCart(prevCart);
    }
  };

  const handleQuantityChange = async (dish, newQuantity) => {
    try {
      const dishId = dish.id;
      
      if (!dishId) {
        alert('Invalid dish data. Please refresh the page and try again.');
        return;
      }
      
      const cartItem = localCart.find(item => item.dish?.id === dishId);
      if (!cartItem) return;

      // Optimistic update
      if (newQuantity === 0) {
        // remember last real id so debounced remover can call API after local removal
        if (typeof cartItem.id !== 'string') {
          lastKnownItemIdRef.current[dishId] = cartItem.id;
        }
        setLocalCart(prev => prev.filter((i) => i.dish?.id !== dishId));
      } else {
        setLocalCart(prev => prev.map((i) => i.dish?.id === dishId ? { ...i, quantity: newQuantity } : i));
      }
      // Debounced sync to backend with latest desired quantity
      scheduleSync(dishId);
    } catch (err) {
      console.error("Error updating cart:", err);
      
      if (err.response?.status === 401) {
        alert('Please log in to update cart.');
      } else if (err.response?.data?.message) {
        alert(`Failed to update cart: ${err.response.data.message}`);
      } else {
        alert('Failed to update cart. Please try again.');
      }
      // Revert: reload latest cart from backend on error for safety
      try {
        const response = await cartAPI.getCart();
        setLocalCart(response.data?.data?.items || []);
      } catch {}
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      const response = await cartAPI.getCart();
      setLocalCart(response.data?.data?.items || []);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      
      if (err.response?.status === 401) {
        alert('Please log in to remove items.');
      } else if (err.response?.data?.message) {
        alert(`Failed to remove item: ${err.response.data.message}`);
      } else {
        alert('Failed to remove item. Please try again.');
      }
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    
    try {
      console.log('Clearing cart');
      await cartAPI.clearCart();
      const response = await cartAPI.getCart();
      const updatedCart = response.data?.data;
      setLocalCart(updatedCart?.items || []);
    } catch (err) {
      console.error("Error clearing cart:", err);
      
      if (err.response?.status === 401) {
        alert('Please log in to clear cart.');
      } else if (err.response?.data?.message) {
        alert(`Failed to clear cart: ${err.response.data.message}`);
      } else {
        alert('Failed to clear cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d327b]">
        <Navbar />
        <LoadingSpinner 
          fullScreen={false} 
          size="large" 
          message="Loading delicious dishes..." 
        />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d327b] px-4 py-16">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-20">
          <ErrorMessage 
            message={error}
            onClose={() => setError(null)}
            type="error"
          />
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-400 text-primary1 font-bold py-3 px-6 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d327b] text-white font-fancy">
        <Navbar />
        <div className="px-4 md:px-20 py-16 overflow-y-auto h-screen">
          {/* Big heading */}
          <h1 className="text-[14rem] md:text-[18rem] font-main text-white/5 absolute top-[-6rem] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0">
            DISHES
          </h1>

          {/* Title */}
          <div className="flex justify-between items-center mb-12 mt-12 relative z-10">
            <h2 className="text-yellow-400 text-4xl md:text-5xl font-main">
              Explore Our Specials
            </h2>
            <Link 
              to="/cart"
              className="md:hidden flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0d327b] font-bold py-2 px-4 rounded-lg shadow-lg hover:from-yellow-300 hover:to-amber-300 transition-all"
            >
              <FaShoppingCart />
              <span>{itemCount}</span>
              {itemCount > 0 && <span className="text-xs">• ${totalPrice.toFixed(2)}</span>}
            </Link>
          </div>

          {/* Dishes Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 relative z-10 mb-16">
            {dishes.map((dish) => {
              const cartItem = localCart.find(item => item.dish?.id === dish.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const isInCart = quantity > 0;
              
              return (
                <div
                  key={dish.id}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-300 hover:shadow-2xl flex flex-col justify-between hover:border-yellow-400/30"
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={dish.image || `https://source.unsplash.com/400x300/?${dish.name.split(' ').join(',')}`}
                      alt={dish.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {isInCart && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-[#0d327b] font-bold text-sm px-2 py-1 rounded-full shadow-lg">
                        {quantity} in cart
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-main text-yellow-300 flex-1">{dish.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-400 ml-2">
                        <FaStar size={12} />
                        <span className="text-xs">4.8</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-200 mt-1 leading-relaxed line-clamp-2">{dish.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-yellow-100">${dish.price.toFixed(2)}</p>
                      <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        🌱 Fresh
                      </div>
                    </div>

                    {!isInCart ? (
                      <button 
                        onClick={() => handleAddToCart(dish)}
                        className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0d327b] font-bold py-3 rounded-xl hover:from-yellow-300 hover:to-amber-300 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaPlus size={16} />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-yellow-400/20 to-amber-400/20 border-2 border-yellow-400 text-white rounded-xl p-2 shadow-lg">
                        <button 
                          onClick={() => handleQuantityChange(dish, quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-all active:scale-95 text-white"
                        >
                          {quantity === 1 ? <FaTrash size={14} /> : <FaMinus size={14} />}
                        </button>
                        <div className="text-center px-4">
                          <span className="font-bold text-2xl text-yellow-400">{quantity}</span>
                          <div className="text-xs text-gray-300">in cart</div>
                        </div>
                        <button 
                          onClick={() => handleQuantityChange(dish, quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-green-500/30 hover:bg-green-500/50 rounded-lg transition-all active:scale-95 text-white"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Footer />
        </div>
    </div>
  );
}

export default Dishes;
