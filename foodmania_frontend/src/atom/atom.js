
import { atom } from 'jotai';

// Helper function to get initial login state
const getInitialLoginState = () => {
  try {
    const savedState = localStorage.getItem('loginState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        ...parsed,
        loading: false    
      };
    }
  } catch (error) {
    console.error('Error parsing stored login state:', error);
  }
  return {
    isLogin: false,
    user: {},
    loading: false
  };
};

// Helper function to get initial cart state
const getInitialCartState = () => {
  try {
    const savedCart = localStorage.getItem('cartState');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error parsing saved cart state:', error);
  }
  return [];
};

// Login state atom
export const loginState = atom(getInitialLoginState());

// Cart state atom with localStorage sync
const cartStateAtom = atom(getInitialCartState());

export const cartState = atom(
  (get) => get(cartStateAtom),
  (get, set, newValue) => {
    set(cartStateAtom, newValue);
    // Sync to localStorage whenever cart changes
    try {
      localStorage.setItem('cartState', JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
);

// Cart totals derived atom
export const cartTotals = atom((get) => {
  const cart = get(cartState);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + ((item.dish?.price || item.price || 0) * item.quantity),
    0
  );
  
  return {
    itemCount,
    totalPrice
  };
});
