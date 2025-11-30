import Card from '../components/Card';
import { FolderOpen } from 'lucide-react';

const ReviewClustersGrid = ({ clusters, onClusterClick }) => {
  if (!clusters || clusters.length === 0) {
    return (
      <Card title="Review Clusters">
        <p className="text-gray-500 text-center py-8">No clusters available</p>
      </Card>
    );
  }

  return (
    <Card title="Review Clusters">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster, index) => (
          <div
            key={index}
            onClick={() => onClusterClick && onClusterClick(cluster.label)}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FolderOpen className="w-4 h-4 text-gray-500 mr-2" />
                <h4 className="font-semibold text-gray-800 truncate">{cluster.label}</h4>
              </div>
              <span className="text-sm text-gray-500">{cluster.count}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">Rating:</span>
              <span className="text-sm font-medium text-gray-700">{cluster.avgRating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                +{cluster.sentiment?.positive || 0}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                -{cluster.sentiment?.negative || 0}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                ~{cluster.sentiment?.neutral || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReviewClustersGrid;

