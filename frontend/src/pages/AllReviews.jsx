import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import Card from '../components/Card';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { getSentimentBadgeColor, formatDateTime, exportToCSV } from '../utils/helpers';
import { Search, Download, Trash2 } from 'lucide-react';

const AllReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ cluster: '', isFake: '' });

  useEffect(() => {
    loadReviews();
  }, [pagination.page, filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter.cluster && { cluster: filter.cluster }),
        ...(filter.isFake !== '' && { isFake: filter.isFake }),
      };
      const response = await reviewService.getAll(params);
      if (response?.data) {
        setReviews(response.data);
        if (response.pagination) setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Client-side search for simplicity
    // In production, this should be server-side
    loadReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.delete(id);
      toast.success('Review deleted');
      loadReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleExport = () => {
    const exportData = reviews.map((review) => ({
      text: review.text,
      sentiment: review.sentiment.overall,
      rating: review.aiRating,
      cluster: review.cluster,
      isFake: review.isFake,
      keywords: review.keywords?.join(', ') || '',
      createdAt: formatDateTime(review.createdAt),
    }));
    exportToCSV(exportData, `reviews_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data exported successfully');
  };

  const filteredReviews = reviews.filter((review) => {
    if (!search) return true;
    return review.text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All Reviews</h2>
          <p className="text-gray-600">Browse and manage all customer reviews</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      <Card>
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter.cluster}
              onChange={(e) => setFilter({ ...filter, cluster: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Clusters</option>
              {/* Add cluster options dynamically */}
            </select>
            <select
              value={filter.isFake}
              onChange={(e) => setFilter({ ...filter, isFake: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Reviews</option>
              <option value="false">Real Only</option>
              <option value="true">Fake Only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews found</p>
        ) : (
          <>
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-700 flex-1">{review.text}</p>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
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
                    <span className="text-xs text-gray-500">Cluster: {review.cluster}</span>
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

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AllReviews;

