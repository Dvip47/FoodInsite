import Card from '../components/Card';
import { Sparkles } from 'lucide-react';

const AISummaryPanel = ({ summary, actionableInsights }) => {
  return (
    <Card title="AI Summary" className="mb-6">
      <div className="flex items-start mb-4">
        <Sparkles className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
        <p className="text-gray-700 leading-relaxed">{summary || 'No summary available yet.'}</p>
      </div>
      
      {actionableInsights && actionableInsights.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Actionable Insights</h4>
          <ul className="space-y-2">
            {actionableInsights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-gray-700 text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default AISummaryPanel;

