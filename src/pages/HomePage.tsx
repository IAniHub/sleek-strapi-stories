
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/ui/PostCard';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchLatestPosts } from '@/services/api';

const HomePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['latestPosts'],
    queryFn: () => fetchLatestPosts(9),
  });

  const posts = data?.data || [];

  return (
    <Layout>
      <div className="bg-blue-50 border-b border-blue-100 py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Welcome to <span className="text-blue-600">SleekBlog</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the latest stories, insights, and ideas from our community of writers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Latest Articles</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message="Failed to load latest posts. Please try again later." />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
