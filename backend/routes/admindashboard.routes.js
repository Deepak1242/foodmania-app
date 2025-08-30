import { Router } from "express";
import { authAdminMiddleware } from "../middleware/auth.middleware.js";
import { 
  getAdminAnalytics, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  getOrdersForAdmin,
  updateOrderStatus
} from "../controllers/admin.controllers.js";
import { 
  getAllDishes, 
  createDish, 
  updateDish, 
  deleteDish 
} from "../controllers/dish.controllers.js";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  validateVoucher
} from "../controllers/voucher.controllers.js";

const router = Router();

// Analytics
router.get("/analytics", authAdminMiddleware, getAdminAnalytics);

// User Management
router.get("/users", authAdminMiddleware, getAllUsers);
router.put("/users/:id/role", authAdminMiddleware, updateUserRole);
router.delete("/users/:id", authAdminMiddleware, deleteUser);

// Order Management
router.get("/orders", authAdminMiddleware, getOrdersForAdmin);
router.put("/orders/:id/status", authAdminMiddleware, updateOrderStatus);

// Dish Management
router.get("/dishes", authAdminMiddleware, getAllDishes);
router.post("/dishes", authAdminMiddleware, createDish);
router.put("/dishes/:id", authAdminMiddleware, updateDish);
router.delete("/dishes/:id", authAdminMiddleware, deleteDish);

// Voucher Management
router.get("/vouchers", authAdminMiddleware, getAllVouchers);
router.post("/vouchers", authAdminMiddleware, createVoucher);
router.get("/vouchers/:id", authAdminMiddleware, getVoucherById);
router.put("/vouchers/:id", authAdminMiddleware, updateVoucher);
router.delete("/vouchers/:id", authAdminMiddleware, deleteVoucher);
router.post("/vouchers/validate/:code", validateVoucher);

export default router;
