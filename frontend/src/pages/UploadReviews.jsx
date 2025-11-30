import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';
import Card from '../components/Card';
import { Upload, Loader } from 'lucide-react';

const UploadReviews = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter a review text');
      return;
    }

    try {
      setLoading(true);
      await reviewService.create(text);
      toast.success('Review analyzed and saved successfully!');
      setText('');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to process review');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast.error('Please upload a .txt file');
      return;
    }

    try {
      setLoading(true);
      const fileContent = await file.text();
      const reviews = fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 10);

      if (reviews.length === 0) {
        toast.error('No valid reviews found in file');
        return;
      }

      toast.loading(`Processing ${reviews.length} reviews...`);
      
      let successCount = 0;
      for (const reviewText of reviews) {
        try {
          await reviewService.create(reviewText);
          successCount++;
        } catch (err) {
          console.error('Failed to process review:', err);
        }
      }

      toast.dismiss();
      toast.success(`Successfully processed ${successCount} out of ${reviews.length} reviews!`);
      // setTimeout(() => {
      //   navigate('/');
      // }, 1500);
    } catch (error) {
      toast.error('Failed to process file');
      console.error(error);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Reviews</h2>
        <p className="text-gray-600">Add customer reviews for AI-powered analysis</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Review Text
            </label>
            <textarea
              id="review"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Enter a customer review here... (e.g., 'The food was amazing! Great service and cozy ambience. Highly recommended!')"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              {text.length} characters (minimum 10 required)
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Review
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Upload</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a .txt file with one review per line
          </p>
          <label className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            <span>Choose File</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleBulkUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};

export default UploadReviews;

