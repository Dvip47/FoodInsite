import Review from '../models/Review.js';

export const generateClusters = async () => {
  try {
    const reviews = await Review.find({});
    
    // Group by existing cluster labels
    const clusterMap = {};
    
    reviews.forEach(review => {
      const cluster = review.cluster || 'uncategorized';
      if (!clusterMap[cluster]) {
        clusterMap[cluster] = {
          label: cluster,
          count: 0,
          reviews: []
        };
      }
      clusterMap[cluster].count++;
      clusterMap[cluster].reviews.push(review);
    });
    
    return Object.values(clusterMap).map(cluster => ({
      label: cluster.label,
      count: cluster.count,
      avgRating: cluster.reviews.reduce((sum, r) => sum + r.aiRating, 0) / cluster.count,
      sentiment: {
        positive: cluster.reviews.filter(r => 
          r.sentiment.overall === 'positive' || r.sentiment.overall === 'very_positive'
        ).length,
        negative: cluster.reviews.filter(r => 
          r.sentiment.overall === 'negative' || r.sentiment.overall === 'very_negative'
        ).length,
        neutral: cluster.reviews.filter(r => r.sentiment.overall === 'neutral').length
      }
    }));
  } catch (error) {
    console.error('Clustering error:', error);
    return [];
  }
};

export const getClusterDetails = async (clusterLabel) => {
  try {
    const reviews = await Review.find({ cluster: clusterLabel })
      .sort({ createdAt: -1 })
      .limit(50);
    
    return reviews;
  } catch (error) {
    console.error('Get cluster details error:', error);
    return [];
  }
};

