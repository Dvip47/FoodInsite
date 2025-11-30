export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'very_positive':
      return 'text-green-700 bg-green-100';
    case 'positive':
      return 'text-green-600 bg-green-50';
    case 'neutral':
      return 'text-gray-600 bg-gray-50';
    case 'negative':
      return 'text-red-600 bg-red-50';
    case 'very_negative':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getSentimentBadgeColor = (sentiment) => {
  switch (sentiment) {
    case 'very_positive':
      return 'bg-green-200 text-green-900 font-semibold';
    case 'positive':
      return 'bg-green-100 text-green-800';
    case 'neutral':
      return 'bg-gray-100 text-gray-800';
    case 'negative':
      return 'bg-red-100 text-red-800';
    case 'very_negative':
      return 'bg-red-200 text-red-900 font-semibold';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSentimentLabel = (sentiment) => {
  switch (sentiment) {
    case 'very_positive':
      return 'Very Positive';
    case 'positive':
      return 'Positive';
    case 'neutral':
      return 'Neutral';
    case 'negative':
      return 'Negative';
    case 'very_negative':
      return 'Very Negative';
    default:
      return sentiment || 'Unknown';
  }
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

