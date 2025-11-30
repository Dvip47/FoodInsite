import Card from '../components/Card';

const TagCloudSection = ({ tags, limit = 30 }) => {
  if (!tags || tags.length === 0) {
    return (
      <Card title="Top Keywords">
        <p className="text-gray-500 text-center py-8">No keywords available</p>
      </Card>
    );
  }

  const maxCount = Math.max(...tags.map(t => t.count));
  const minCount = Math.min(...tags.map(t => t.count));

  const getTagSize = (count) => {
    if (maxCount === minCount) return 'text-base';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'text-2xl font-bold';
    if (ratio > 0.4) return 'text-xl font-semibold';
    if (ratio > 0.2) return 'text-lg';
    return 'text-base';
  };

  const getTagColor = (count) => {
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'text-primary-700 bg-primary-100';
    if (ratio > 0.4) return 'text-primary-600 bg-primary-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card title="Top Keywords">
      <div className="flex flex-wrap gap-3 py-4">
        {tags.slice(0, limit).map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1.5 rounded-full ${getTagSize(tag.count)} ${getTagColor(tag.count)} transition-all hover:scale-105 cursor-default`}
            title={`Used ${tag.count} times`}
          >
            {tag.keyword}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default TagCloudSection;

