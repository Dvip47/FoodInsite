import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data, period = 'weekly' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Positive"
        />
        <Line 
          type="monotone" 
          dataKey="negative" 
          stroke="#ef4444" 
          strokeWidth={2}
          name="Negative"
        />
        <Line 
          type="monotone" 
          dataKey="neutral" 
          stroke="#6b7280" 
          strokeWidth={2}
          name="Neutral"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;

