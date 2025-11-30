import { body, validationResult } from 'express-validator';

export const validateReview = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ min: 10, max: 9000 })
    .withMessage('Review text must be between 10 and 9000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

