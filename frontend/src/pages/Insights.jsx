import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import AISummaryPanel from '../sections/AISummaryPanel';
import TrendChart from '../charts/TrendChart';
import Card from '../components/Card';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { RefreshCw } from 'lucide-react';

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState([]);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    loadInsights();
  }, [period]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [insightsData, trendsData] = await Promise.all([
        reviewService.getInsights(),
        reviewService.getTrends(period),
      ]);

      if (insightsData?.data) setInsights(insightsData.data);
      if (trendsData?.data) setTrends(trendsData.data);
    } catch (error) {
      toast.error('Failed to load insights');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadInsights();
    toast.success('Insights refreshed');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Insights</h2>
          <p className="text-gray-600">Comprehensive analysis of your customer reviews</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      <AISummaryPanel
        summary={insights?.summary}
        actionableInsights={insights?.actionableInsights}
      />

      <Card
        title="Trend Analysis"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1 text-sm rounded ${
                period === 'weekly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 text-sm rounded ${
                period === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>
        }
      >
        <TrendChart data={trends} period={period} />
      </Card>

      {insights?.topKeywords && insights.topKeywords.length > 0 && (
        <Card title="Top Keywords">
          <div className="space-y-2">
            {insights.topKeywords.slice(0, 20).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">{item.keyword}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.count} reviews
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Insights;

