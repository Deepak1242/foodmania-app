import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authUserMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // check if the user exists in the database
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user; // Attach user to request object
      next();
      
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // check if the user exists in the database
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      req.user = user; // Attach user to request object
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
