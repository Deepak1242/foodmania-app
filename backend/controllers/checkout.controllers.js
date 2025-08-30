import { PrismaClient } from '@prisma/client';
import stripe from '../config/stripe.config.js';

const prisma = new PrismaClient();

// Create Stripe checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { voucherCode, deliveryAddress, isDemo = false } = req.body;

    // Get cart items
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            dish: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.dish.price * item.quantity;
      subtotal += itemTotal;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.dish.price,
        total: itemTotal
      };
    });

    let discount = 0;
    let appliedVoucherId = null;

    // Apply voucher if provided (simplified for demo)
    if (voucherCode && voucherCode.toUpperCase().startsWith('DEMO')) {
      discount = subtotal * 0.15; // 15% discount for demo vouchers
    }

    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 50 ? 0 : 5;
    const total = subtotal - discount + tax + deliveryFee;

    // Handle demo payment
    if (isDemo) {
      // Create order directly for demo
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentId: 'DEMO_' + Date.now(),
          address: deliveryAddress || 'Demo Address'
        }
      });

      // Create order items separately
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            dishId: item.dishId,
            quantity: item.quantity
          }
        });
      }

      // Skip voucher usage update since voucher table doesn't exist

      // Clear cart completely
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.delete({ where: { id: cart.id } });

      return res.json({
        success: true,
        isDemo: true,
        orderId: order.id,
        message: 'Demo order placed successfully'
      });
    }

    // Create Stripe session for real payment
    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.dish.name,
          description: item.dish.description,
          images: [item.dish.imageUrl],
        },
        unit_amount: Math.round(item.dish.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add discount as a coupon if applicable
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5176'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5176'}/cart`,
      metadata: {
        userId: userId.toString(),
        voucherId: appliedVoucherId ? appliedVoucherId.toString() : '',
        deliveryAddress: deliveryAddress || '',
        subtotal: subtotal.toString(),
        discount: discount.toString(),
        tax: tax.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
      },
    };

    if (discount > 0) {
      sessionConfig.discounts = [{
        coupon: await stripe.coupons.create({
          amount_off: Math.round(discount * 100),
          currency: 'usd',
          duration: 'once',
        })
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Handle successful payment webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    try {
      // Create order
      const order = await prisma.order.create({
        data: {
          userId: parseInt(metadata.userId),
          total: parseFloat(metadata.total),
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentId: session.id,
          address: metadata.deliveryAddress || 'Stripe Payment Address'
        }
      });

      // Get cart and create order items
      const cart = await prisma.cart.findFirst({
        where: { userId: parseInt(metadata.userId) },
        include: { items: true }
      });

      if (cart) {
        for (const item of cart.items) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              dishId: item.dishId,
              quantity: item.quantity
            }
          });
        }

        // Clear cart completely
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        await prisma.cart.delete({ where: { id: cart.id } });
      }

      // Update voucher usage
      if (metadata.voucherId) {
        await prisma.voucher.update({
          where: { id: parseInt(metadata.voucherId) },
          data: { usedCount: { increment: 1 } }
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  res.json({ received: true });
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderId),
        userId
      },
      include: {
        items: {
          include: {
            dish: true
          }
        },
        voucher: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Update order delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, location } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status,
        currentLocation: location,
        updatedAt: new Date()
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};
