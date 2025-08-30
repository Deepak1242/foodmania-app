

import express from 'express';
import { getAllOrders, getOrderById, placeOrder, updateOrder, deleteOrder , getOrdersByUserId} from '../controllers/orders.controllers.js';
import { authAdminMiddleware, authUserMiddleware } from '../middleware/auth.middleware.js';         

const router = express.Router();

// Route to get all orders
router.get('/', authAdminMiddleware, getAllOrders);

router.get('/user', authUserMiddleware, getOrdersByUserId); // Route to get orders by user ID
// Route to get an order by ID
router.get('/:id', authAdminMiddleware, getOrderById);
// Route to create a new order
router.post('/', authUserMiddleware, placeOrder);
// Route to update an order by ID
router.put('/:id', authAdminMiddleware, updateOrder);
// Route to delete an order by ID
router.delete('/:id', authAdminMiddleware, deleteOrder);

export default router;