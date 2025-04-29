
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/ui/PostCard';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import PageHeader from '@/components/ui/PageHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchPostsByAuthor } from '@/services/api';

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const authorId = parseInt(id || '0');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['authorPosts', authorId],
    queryFn: () => fetchPostsByAuthor(authorId),
    enabled: !!authorId,
  });

  const posts = data?.data || [];
  const authorName = posts[0]?.attributes?.author?.data?.attributes?.name || 'Author';

  return (
    <Layout>
      <PageHeader 
        title={`Posts by ${authorName}`}
        description={`Browse all articles written by ${authorName}.`}
      />
      
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message="Failed to load author posts. Please try again later." />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found by this author.</p>
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

export default AuthorPage;
