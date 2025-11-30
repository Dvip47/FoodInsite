import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import TagCloudSection from '../sections/TagCloudSection';
import Card from '../components/Card';
import { CardSkeleton } from '../components/LoadingSkeleton';

const TagCloud = () => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    loadTags();
  }, [limit]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getTags(limit);
      if (response?.data) setTags(response.data);
    } catch (error) {
      toast.error('Failed to load tags');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tag Cloud</h2>
        <p className="text-gray-600">Visual representation of frequently mentioned keywords</p>
      </div>

      <Card
        title="Display Options"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setLimit(30)}
              className={`px-3 py-1 text-sm rounded ${
                limit === 30
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30
            </button>
            <button
              onClick={() => setLimit(50)}
              className={`px-3 py-1 text-sm rounded ${
                limit === 50
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              50
            </button>
            <button
              onClick={() => setLimit(100)}
              className={`px-3 py-1 text-sm rounded ${
                limit === 100
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              100
            </button>
          </div>
        }
      />

      <TagCloudSection tags={tags} limit={limit} />

      {tags.length > 0 && (
        <Card title="Keyword Statistics">
          <div className="space-y-2">
            {tags.slice(0, 20).map((tag, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">{tag.keyword}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{tag.count} occurrences</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600"
                      style={{
                        width: `${(tag.count / tags[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TagCloud;

