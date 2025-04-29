
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/ui/PostCard';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import PageHeader from '@/components/ui/PageHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchPostsByCategory } from '@/services/api';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryPosts', slug],
    queryFn: () => fetchPostsByCategory(slug || ''),
    enabled: !!slug,
  });

  const posts = data?.data || [];
  const categoryName = posts[0]?.attributes?.categories?.data?.find(
    (cat) => cat.attributes.slug === slug
  )?.attributes.name || slug;

  return (
    <Layout>
      <PageHeader 
        title={categoryName}
        description={`Browse all articles in the ${categoryName} category.`}
      />
      
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message="Failed to load category posts. Please try again later." />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found in this category.</p>
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

export default CategoryPage;
