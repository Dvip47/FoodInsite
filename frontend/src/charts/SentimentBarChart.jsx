import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SentimentBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No sentiment data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="positive" fill="#10b981" name="Positive" />
        <Bar dataKey="negative" fill="#ef4444" name="Negative" />
        <Bar dataKey="neutral" fill="#6b7280" name="Neutral" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentBarChart;

