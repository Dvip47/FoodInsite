import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import MetricsCards from '../sections/MetricsCards';
import AISummaryPanel from '../sections/AISummaryPanel';
import TagCloudSection from '../sections/TagCloudSection';
import ReviewClustersGrid from '../sections/ReviewClustersGrid';
import TrendChart from '../charts/TrendChart';
import SentimentBarChart from '../charts/SentimentBarChart';
import Card from '../components/Card';
import { CardSkeleton } from '../components/LoadingSkeleton';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState([]);
  const [tags, setTags] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [insightsData, trendsData, tagsData, clustersData, reviewsData] = await Promise.all([
        reviewService.getInsights().catch(() => null),
        reviewService.getTrends('weekly').catch(() => []),
        reviewService.getTags(30).catch(() => []),
        reviewService.getClusters().catch(() => []),
        reviewService.getAll({ limit: 1000 }).catch(() => ({ data: [] })),
      ]);

      if (insightsData?.data) setInsights(insightsData.data);
      if (trendsData?.data) setTrends(trendsData.data);
      if (tagsData?.data) setTags(tagsData.data);
      if (clustersData?.data) setClusters(clustersData.data);
      if (reviewsData?.data) setReviews(reviewsData.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClusterClick = (clusterLabel) => {
    navigate('/clusters', { state: { selectedCluster: clusterLabel } });
  };

  // Calculate category sentiment from reviews
  const sentimentData = reviews.length > 0 ? [
    {
      category: 'Taste',
      positive: reviews.filter(r => 
        r.sentiment?.taste === 'positive' || r.sentiment?.taste === 'very_positive'
      ).length,
      negative: reviews.filter(r => 
        r.sentiment?.taste === 'negative' || r.sentiment?.taste === 'very_negative'
      ).length,
      neutral: reviews.filter(r => r.sentiment?.taste === 'neutral').length,
    },
    {
      category: 'Service',
      positive: reviews.filter(r => 
        r.sentiment?.service === 'positive' || r.sentiment?.service === 'very_positive'
      ).length,
      negative: reviews.filter(r => 
        r.sentiment?.service === 'negative' || r.sentiment?.service === 'very_negative'
      ).length,
      neutral: reviews.filter(r => r.sentiment?.service === 'neutral').length,
    },
    {
      category: 'Ambience',
      positive: reviews.filter(r => 
        r.sentiment?.ambience === 'positive' || r.sentiment?.ambience === 'very_positive'
      ).length,
      negative: reviews.filter(r => 
        r.sentiment?.ambience === 'negative' || r.sentiment?.ambience === 'very_negative'
      ).length,
      neutral: reviews.filter(r => r.sentiment?.ambience === 'neutral').length,
    },
    {
      category: 'Hygiene',
      positive: reviews.filter(r => 
        r.sentiment?.hygiene === 'positive' || r.sentiment?.hygiene === 'very_positive'
      ).length,
      negative: reviews.filter(r => 
        r.sentiment?.hygiene === 'negative' || r.sentiment?.hygiene === 'very_negative'
      ).length,
      neutral: reviews.filter(r => r.sentiment?.hygiene === 'neutral').length,
    },
    {
      category: 'Delivery',
      positive: reviews.filter(r => 
        r.sentiment?.delivery === 'positive' || r.sentiment?.delivery === 'very_positive'
      ).length,
      negative: reviews.filter(r => 
        r.sentiment?.delivery === 'negative' || r.sentiment?.delivery === 'very_negative'
      ).length,
      neutral: reviews.filter(r => r.sentiment?.delivery === 'neutral').length,
    },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">AI-powered insights into your customer reviews</p>
      </div>

      <MetricsCards metrics={insights?.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sentiment Trends">
          <TrendChart data={trends} period="weekly" />
        </Card>
        <Card title="Category Sentiment">
          <SentimentBarChart data={sentimentData} />
        </Card>
      </div>

      <AISummaryPanel
        summary={insights?.summary}
        actionableInsights={insights?.actionableInsights}
      />

      <TagCloudSection tags={tags} limit={30} />

      <ReviewClustersGrid clusters={clusters} onClusterClick={handleClusterClick} />
    </div>
  );
};

export default Dashboard;

