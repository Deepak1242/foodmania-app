import express from "express";
import { getAllDishes, getDishById, createDish, updateDish, deleteDish,searchAndFilterDishes } from "../controllers/dish.controllers.js"; 
import { authAdminMiddleware,authUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();



// Route to create a new dish

//search and filter dishes
router.get("/search", (req, res, next) => {
  console.log("/search route hit");
  next();
}, searchAndFilterDishes);

// Route to get all dishes
router.get("/", getAllDishes);
// Route to get a dish by ID
router.get("/:id", getDishById);


router.post("/",authAdminMiddleware, createDish);
// Route to update a dish by ID
router.put("/:id",authAdminMiddleware, updateDish);
// Route to delete a dish by ID
router.delete("/:id", authAdminMiddleware, deleteDish);  




// Export the router


export default router;

