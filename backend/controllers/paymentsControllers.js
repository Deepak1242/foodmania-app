import { PrismaClient } from '@prisma/client';
import stripe from '../config/stripe.config.js';

const prisma = new PrismaClient();

// Create a new payment intent
export const createPaymentIntent = async(req,res)=>{
    try{
        
        const { amount, userId, items, address } = req.body;


      if (!amount || !userId || !items || !address) {
      return res.status(400).json({ message: "Missing payment info" });}

        // Create a new payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // in cents
            currency: "dollar",
            metadata: {
            userId: userId.toString()
      }
        })

        // 2. Store a pending order in the DB
      const order = await prisma.order.create({
      data: {
        userId,
        total: amount,
        address,
        paymentId: paymentIntent.id,
        paymentStatus: "PENDING",
        items: {
            create: items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });
}
    catch(error){
        console.error("Create Payment Intent Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message, stack: error.stack });
    }
}
