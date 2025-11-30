import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import ReviewClustersGrid from '../sections/ReviewClustersGrid';
import Card from '../components/Card';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { getSentimentBadgeColor, formatDateTime } from '../utils/helpers';

const ClusterView = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(
    location.state?.selectedCluster || null
  );
  const [clusterReviews, setClusterReviews] = useState([]);

  useEffect(() => {
    loadClusters();
  }, []);

  useEffect(() => {
    if (selectedCluster) {
      loadClusterReviews(selectedCluster);
    }
  }, [selectedCluster]);

  const loadClusters = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getClusters();
      if (response?.data) setClusters(response.data);
    } catch (error) {
      toast.error('Failed to load clusters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadClusterReviews = async (clusterLabel) => {
    try {
      const response = await reviewService.getAll({ cluster: clusterLabel });
      if (response?.data) setClusterReviews(response.data);
    } catch (error) {
      toast.error('Failed to load cluster reviews');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Review Clusters</h2>
        <p className="text-gray-600">Grouped reviews by AI-identified themes</p>
      </div>

      <ReviewClustersGrid
        clusters={clusters}
        onClusterClick={(label) => setSelectedCluster(label)}
      />

      {selectedCluster && (
        <Card
          title={`Reviews in "${selectedCluster}"`}
          action={
            <button
              onClick={() => setSelectedCluster(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          }
        >
          {clusterReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews found in this cluster</p>
          ) : (
            <div className="space-y-4">
              {clusterReviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <p className="text-gray-700 mb-3">{review.text}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getSentimentBadgeColor(
                        review.sentiment.overall
                      )}`}
                    >
                      {review.sentiment.overall}
                    </span>
                    <span className="text-xs text-gray-500">
                      Rating: {review.aiRating}/5
                    </span>
                    {review.isFake && (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        Fake
                      </span>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatDateTime(review.createdAt)}
                    </span>
                  </div>
                  {review.keywords && review.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {review.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ClusterView;

