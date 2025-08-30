import express from 'express';
import { createPaymentIntent } from '../controllers/paymentsControllers.js';

const router = express.Router();

router.post('/create-intent', createPaymentIntent);

export default router;