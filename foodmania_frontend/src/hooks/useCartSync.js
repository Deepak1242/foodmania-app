import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { cartState } from '../atom/atom';
import { cartAPI } from '../api/api';

// Custom hook to handle cart synchronization
export const useCartSync = () => {
  const [cart, setCart] = useAtom(cartState);

  // Function to sync cart with backend
  const syncCartWithBackend = async () => {
    try {
      const response = await cartAPI.getCart();
      const serverCart = response.data?.data?.items || [];
      
      // Only update if there's a meaningful difference
      if (JSON.stringify(cart) !== JSON.stringify(serverCart)) {
        setCart(serverCart);
      }
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
      // Don't clear cart on sync failure to avoid bad UX
    }
  };

  // Function to clear cart completely
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
      localStorage.removeItem('cartState');
      // Dispatch custom event for immediate sync
      window.dispatchEvent(new Event('cart-cleared'));
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Clear locally even if server fails
      setCart([]);
      localStorage.removeItem('cartState');
      window.dispatchEvent(new Event('cart-cleared'));
    }
  };

  return {
    cart,
    setCart,
    syncCartWithBackend,
    clearCart
  };
};
