import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FoodInsight API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

