import express from 'express';
import { authUserMiddleware } from '../middleware/auth.middleware.js';
import {
  createCheckoutSession,
  handleStripeWebhook,
  getOrderDetails,
  updateDeliveryStatus
} from '../controllers/checkout.controllers.js';

const router = express.Router();

// Checkout routes
router.post('/create-session', authUserMiddleware, createCheckoutSession);
router.get('/order/:orderId', authUserMiddleware, getOrderDetails);
router.put('/order/:orderId/delivery', authUserMiddleware, updateDeliveryStatus);

// Stripe webhook (no auth needed)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
