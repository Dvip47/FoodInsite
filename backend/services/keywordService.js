import Review from '../models/Review.js';

export const extractTopKeywords = async (limit = 20) => {
  try {
    const reviews = await Review.find({});
    
    const keywordCount = {};
    
    reviews.forEach(review => {
      if (review.keywords && Array.isArray(review.keywords)) {
        review.keywords.forEach(keyword => {
          const normalized = keyword.toLowerCase().trim();
          if (normalized) {
            keywordCount[normalized] = (keywordCount[normalized] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return [];
  }
};

