import Stripe from 'stripe';

// Validate Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
  typescript: true,
  timeout: 10000, // 10 second timeout
});

export default stripe;
