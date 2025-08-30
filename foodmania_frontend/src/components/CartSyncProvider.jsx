import React, { createContext, useContext, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cartState } from '../atom/atom';
import { cartAPI } from '../api/api';

const CartSyncContext = createContext();

export const useCartSync = () => {
  const context = useContext(CartSyncContext);
  if (!context) {
    throw new Error('useCartSync must be used within CartSyncProvider');
  }
  return context;
};

export const CartSyncProvider = ({ children }) => {
  const [cart, setCart] = useAtom(cartState);

  // Sync cart with backend
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
    }
  };

  // Clear cart completely
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCart([]);
    }
  };

  // Force refresh cart from server
  const refreshCart = async () => {
    try {
      const response = await cartAPI.getCart();
      const serverCart = response.data?.data?.items || [];
      setCart(serverCart);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  };

  const value = {
    cart,
    setCart,
    syncCartWithBackend,
    clearCart,
    refreshCart
  };

  return (
    <CartSyncContext.Provider value={value}>
      {children}
    </CartSyncContext.Provider>
  );
};
