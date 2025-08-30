import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            dish: true
          }
        }
      }
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], total: 0 }
      });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.dish.price), 0);

    res.status(200).json({
      success: true,
      data: {
        items: cart.items,
        total
      }
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart'
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dishId, quantity = 1 } = req.body;
    const dishIdInt = parseInt(dishId);
    const qty = parseInt(quantity) || 1;

    if (!dishIdInt || isNaN(dishIdInt)) {
      return res.status(400).json({
        success: false,
        message: 'Dish ID is required'
      });
    }

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: dishIdInt }
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        dishId: dishIdInt
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
        include: { dish: true }
      });

      return res.status(200).json({
        success: true,
        data: updatedItem,
        message: 'Item quantity updated in cart'
      });
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          dishId: dishIdInt,
          quantity: qty
        },
        include: { dish: true }
      });

      return res.status(201).json({
        success: true,
        data: newItem,
        message: 'Item added to cart'
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const itemIdInt = parseInt(itemId);
    const qty = parseInt(quantity);

    if (!qty || qty < 1 || !itemIdInt || isNaN(itemIdInt)) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemIdInt,
        cart: { userId }
      },
      include: { dish: true }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemIdInt },
      data: { quantity: qty },
      include: { dish: true }
    });

    res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Cart item updated'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const itemIdInt = parseInt(itemId);

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemIdInt,
        cart: { userId }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await prisma.cartItem.delete({
      where: { id: itemIdInt }
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is already empty'
      });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};
