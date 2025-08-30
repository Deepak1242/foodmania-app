import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cart.controllers.js';
import { authUserMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authUserMiddleware);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update cart item quantity
router.put('/:itemId', updateCartItem);

// Remove item from cart
router.delete('/:itemId', removeFromCart);

// Clear entire cart
router.delete('/', clearCart);

export default router;
