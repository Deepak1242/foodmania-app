import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// ----------- CREATE DISH ------------
export const createDish = async (req, res) => {
  try {
    // Log the request body for debugging
   
    const { name, description, price, image, category } = req.body;
    console.log("Request Body:", req.body);

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // dish exists check (name + category if category is provided)
    const existingDish = await prisma.dish.findFirst({
      where: {
        name,
      }
    });
    if (existingDish) {
      return res.status(409).json({ message: "Dish already exists" });
    }   

    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        category: category || null
      }
    });
    res.status(201).json({ message: "Dish added", dish });
  } catch (err) {
    console.log ("fat gya baba")
    console.error("Add Dish Error:", err);
    res.status(500).json({ message: "sheer", error: err.message, stack: err.stack });
  }
};


// ----------- GET ALL DISHES ------------

export const getAllDishes = async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany();
    res.status(200).json(dishes);
  } catch (err) {
    console.error("Get All Dishes Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ----------- GET DISH BY ID ------------

export const getDishById = async (req, res) => {
  const { id } = req.params;

  // Validate id
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid or missing dish id" });
  }

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: parseInt(id) }
    });

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json(dish);
  } catch (err) {
    console.error("Get Dish By ID Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ----------- UPDATE DISH ------------
export const updateDish = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category } = req.body;

  try {
    const dish = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), image, category }
    });

    res.status(200).json({ message: "Dish updated", dish });
  } catch (err) {
    console.error("Update Dish Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
// ----------- DELETE DISH ------------
export const deleteDish = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.dish.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "Dish deleted" });
  } catch (err) {
    console.error("Delete Dish Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ----------- SEARCH & FILTER DISHES ------------

export const searchAndFilterDishes = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sortBy = "price",
      sortOrder = "asc"
    } = req.query;

    const filters = {};

    if (keyword) {
      filters.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } }
      ];
    }

    if (category) {
      filters.category = { equals: category, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    const dishes = await prisma.dish.findMany({
      where: filters,
      include: {
        reviews: true
      },
      orderBy: sortBy === "price" ? { price: sortOrder } : undefined
    });

    const result = dishes.map((dish) => {
      const totalRating = dish.reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = dish.reviews.length
        ? (totalRating / dish.reviews.length).toFixed(1)
        : null;

      return {
        ...dish,
        avgRating,
        reviewCount: dish.reviews.length
      };
    });

    res.status(200).json({ dishes: result });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed", error: error.message, stack: error.stack });
  }
};
