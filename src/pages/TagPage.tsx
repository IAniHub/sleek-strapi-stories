
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/ui/PostCard';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import PageHeader from '@/components/ui/PageHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchPostsByTag } from '@/services/api';

const TagPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['tagPosts', slug],
    queryFn: () => fetchPostsByTag(slug || ''),
    enabled: !!slug,
  });

  const posts = data?.data || [];
  const tagName = posts[0]?.attributes?.tags?.data?.find(
    (tag) => tag.attributes.slug === slug
  )?.attributes.name || slug;

  return (
    <Layout>
      <PageHeader 
        title={`#${tagName}`}
        description={`Browse all articles tagged with #${tagName}.`}
      />
      
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message="Failed to load tagged posts. Please try again later." />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found with this tag.</p>
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

export default TagPage;
