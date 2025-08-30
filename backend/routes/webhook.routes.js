import express from "express";
import Stripe from "stripe";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// We'll initialize Stripe within the webhook handler to ensure env vars are loaded

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Initialize Stripe within the handler to ensure env vars are loaded
  const stripe = new Stripe(process.env.SECRET_KEY);
  
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update order
    await prisma.order.updateMany({
      where: { paymentId: paymentIntent.id },
      data: { paymentStatus: "COMPLETED" }
    });

    console.log("💰 Payment confirmed and order updated");
  }

  res.json({ received: true });
});

export default router;
