import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ----------- CREATE VOUCHER ------------
export const createVoucher = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!code || !name || !discountType || !discountValue) {
      return res.status(400).json({ 
        success: false, 
        message: "Code, name, discount type, and discount value are required" 
      });
    }

    // Check if voucher code already exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingVoucher) {
      return res.status(409).json({ 
        success: false, 
        message: "Voucher code already exists" 
      });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase(),
        name,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.status(201).json({
      success: true,
      message: "Voucher created successfully",
      data: voucher
    });
  } catch (error) {
    console.error("Create voucher error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// ----------- GET ALL VOUCHERS ------------
export const getAllVouchers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status === 'active') {
      where.isActive = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ];
    } else if (status === 'expired') {
      where.OR = [
        { isActive: false },
        { expiresAt: { lt: new Date() } }
      ];
    }

    const vouchers = await prisma.voucher.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    const totalVouchers = await prisma.voucher.count({ where });

    res.status(200).json({
      success: true,
      data: {
        vouchers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalVouchers,
          pages: Math.ceil(totalVouchers / limit)
        }
      }
    });
  } catch (error) {
    console.error("Get vouchers error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// ----------- GET VOUCHER BY ID ------------
export const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await prisma.voucher.findUnique({
      where: { id: parseInt(id) },
      include: {
        orders: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } }
          }
        }
      }
    });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: "Voucher not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    console.error("Get voucher error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// ----------- UPDATE VOUCHER ------------
export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      isActive,
      expiresAt
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (discountType) updateData.discountType = discountType;
    if (discountValue) updateData.discountValue = parseFloat(discountValue);
    if (minOrderAmount !== undefined) updateData.minOrderAmount = parseFloat(minOrderAmount);
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? parseInt(usageLimit) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const voucher = await prisma.voucher.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: "Voucher updated successfully",
      data: voucher
    });
  } catch (error) {
    console.error("Update voucher error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// ----------- DELETE VOUCHER ------------
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if voucher has been used in orders
    const voucherWithOrders = await prisma.voucher.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { orders: true } } }
    });

    if (!voucherWithOrders) {
      return res.status(404).json({ 
        success: false, 
        message: "Voucher not found" 
      });
    }

    if (voucherWithOrders._count.orders > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete voucher that has been used in orders. Deactivate it instead." 
      });
    }

    await prisma.voucher.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: "Voucher deleted successfully"
    });
  } catch (error) {
    console.error("Delete voucher error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// ----------- VALIDATE VOUCHER ------------
export const validateVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const { orderAmount } = req.body;

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: "Voucher not found" 
      });
    }

    // Check if voucher is active
    if (!voucher.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: "Voucher is not active" 
      });
    }

    // Check if voucher has expired
    if (voucher.expiresAt && new Date() > voucher.expiresAt) {
      return res.status(400).json({ 
        success: false, 
        message: "Voucher has expired" 
      });
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: "Voucher usage limit reached" 
      });
    }

    // Check minimum order amount
    if (orderAmount < voucher.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount is $${voucher.minOrderAmount}` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * voucher.discountValue) / 100;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else {
      discountAmount = voucher.discountValue;
    }

    res.status(200).json({
      success: true,
      data: {
        voucher,
        discountAmount,
        finalAmount: orderAmount - discountAmount
      }
    });
  } catch (error) {
    console.error("Validate voucher error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};
