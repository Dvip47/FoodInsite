import { TrendingUp, Star, AlertTriangle, MessageSquare } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const MetricsCards = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Reviews"
        value={metrics.total || 0}
        icon={MessageSquare}
        color="primary"
      />
      <MetricCard
        title="Positive Ratio"
        value={`${metrics.positiveRatio || 0}%`}
        icon={TrendingUp}
        color="green"
        trend="vs last period"
      />
      <MetricCard
        title="Avg Rating"
        value={metrics.avgRating || '0.0'}
        icon={Star}
        color="yellow"
      />
      <MetricCard
        title="Fake Reviews"
        value={metrics.fakeCount || 0}
        icon={AlertTriangle}
        color="red"
      />
    </div>
  );
};

export default MetricsCards;

