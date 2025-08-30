import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();


export const createReview = async (req, res)=>{
    try {
        const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const { dishId } = req.params;
        const dish = await prismaClient.dish.findUnique({
            where: { id: parseInt(dishId) }
        });
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        // Check if the user has already reviewed this dish
        const existingReview = await prismaClient.review.findFirst({
            where: {
                dishId: parseInt(dishId),
                userId: userId
            }
        });
        if (existingReview) {
            return res.status(409).json({ message: "You have already reviewed this dish" });
        }
        // Create the review
        const { rating, comment } = req.body;

        if (!rating && rating > 0 && rating < 6) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const review = await prismaClient.review.create({
            data: {

                rating: parseInt(rating),
                comment: comment || null,
                dishId: parseInt(dishId),
                userId: userId

            }
        });

        res.status(201).json({ message: "Review created successfully", review });


    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getReviewsByDishId = async (req, res) => {
    try {
        const { dishId } = req.params;
        const reviews = await prismaClient.review.findMany({
            where: { dishId: parseInt(dishId) },
            include: {
                user: true // Include user details in the review
            }
        });
        // find many provides an array !!
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this dish" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// update review
export const updateReview = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Validate rating
        if (!rating && rating > 0 && rating < 6) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if the review exists and belongs to the user
        const review = await prismaClient.review.findUnique({
            where: { id: parseInt(reviewId) }
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "You can only update your own reviews" });
        }

        // Update the review
        const updatedReview = await prismaClient.review.update({
            where: { id: parseInt(reviewId) },
            data: {
                rating: parseInt(rating),
                comment: comment || null
            }
        });

        res.status(200).json({ message: "Review updated successfully", updatedReview });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// delete review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const { reviewId } = req.params;

        // Check if the review exists and belongs to the user
        const review = await prismaClient.review.findUnique({
            where: { id: parseInt(reviewId) }
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }

        // Delete the review
        await prismaClient.review.delete({
            where: { id: parseInt(reviewId) }
        });

        res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


export const getAvgreviewByDishId = async (req, res) => {
    try {
        const { dishId } = req.params;
        const reviews = await prismaClient.review.findMany({
            where: { dishId: parseInt(dishId) },
            select: {
                rating: true
            }
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this dish" });
        }

        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        res.status(200).json({ averageRating: averageRating.toFixed(2) });

    } catch (error) {
        console.error("Error fetching average rating:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}