

import express from 'express';
import { getAvgreviewByDishId,getReviewsByDishId, createReview, updateReview, deleteReview } from '../controllers/reviews.controllers.js';
import { authUserMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();


// Route to get a review by ID
router.get('/:dishId', authUserMiddleware, getReviewsByDishId);  
// Route to create a new review
router.post('/:dishId', authUserMiddleware, createReview);

// Route to update a review by ID
router.put('/:reviewId', authUserMiddleware, updateReview);
// Route to delete a review by ID
router.delete('/:reviewId', authUserMiddleware, deleteReview);

router.get('/avg/:dishId',authUserMiddleware, getAvgreviewByDishId);


export default router;

