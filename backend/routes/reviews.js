import express from 'express';
import { apiLimiter, uploadLimiter } from '../middleware/rateLimiter.js';
import { validateReview } from '../middleware/validator.js';
import {
  createReview,
  getAllReviews,
  getInsights,
  getTrends,
  getTags,
  getClusters,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', uploadLimiter, validateReview, createReview);
router.get('/all', apiLimiter, getAllReviews);
router.get('/insights', apiLimiter, getInsights);
router.get('/trends', apiLimiter, getTrends);
router.get('/tags', apiLimiter, getTags);
router.get('/clusters', apiLimiter, getClusters);
router.delete('/:id', apiLimiter, deleteReview);

export default router;

