import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import UploadReviews from './pages/UploadReviews';
import Insights from './pages/Insights';
import TagCloud from './pages/TagCloud';
import ClusterView from './pages/ClusterView';
import AllReviews from './pages/AllReviews';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReviews />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/tags" element={<TagCloud />} />
          <Route path="/clusters" element={<ClusterView />} />
          <Route path="/reviews" element={<AllReviews />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;

