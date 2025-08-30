import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ----------- ANALYTICS ------------
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalDishes = await prisma.dish.count();
    const totalReviews = await prisma.review.count();

    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });
    const totalRevenueAmount = totalRevenue._sum.total || 0;

    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const pastWeekOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: {
        createdAt: true
      }
    });

    const ordersPerDay = Array(7).fill(0);
    pastWeekOrders.forEach((order) => {
      const dayIndex = 6 - Math.floor((new Date() - order.createdAt) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex <= 6) {
        ordersPerDay[dayIndex]++;
      }
    });

    // Recent orders for dashboard with delivery tracking
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { dish: { select: { name: true } } } },
        voucher: { select: { code: true, discountType: true, discountValue: true } }
      }
    });

    // Active deliveries (orders that are being delivered)
    const activeDeliveries = await prisma.order.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        items: { include: { dish: { select: { name: true } } } }
      }
    });

    // Top dishes by order count
    const topDishes = await prisma.orderItem.groupBy({
      by: ['dishId'],
      _count: { dishId: true },
      _sum: { quantity: true },
      orderBy: { _count: { dishId: 'desc' } },
      take: 5
    });

    const topDishesWithDetails = await Promise.all(
      topDishes.map(async (item) => {
        const dish = await prisma.dish.findUnique({
          where: { id: item.dishId },
          select: { name: true, price: true, image: true }
        });
        return {
          ...dish,
          orderCount: item._count.dishId,
          totalQuantity: item._sum.quantity
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDishes,
        totalOrders,
        totalRevenue: totalRevenueAmount,
        orderStatusStats: statusCounts,
        ordersPerDay: ordersPerDay.reverse(),
        recentOrders,
        topDishes: topDishesWithDetails,
        activeDeliveries,
        totalReviews
      }
    });

  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// ----------- USER MANAGEMENT ------------
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const users = await prisma.user.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          orders: true
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalUsers = await prisma.user.count({ where });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// ----------- ORDER MANAGEMENT ------------
export const getOrdersForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { id: isNaN(search) ? undefined : parseInt(search) }
      ].filter(Boolean);
    }

    const orders = await prisma.order.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            dish: { select: { name: true, price: true, image: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalOrders = await prisma.order.count({ where });

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            dish: { select: { name: true, price: true } }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};