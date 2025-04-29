
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, User, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchPostBySlug, getStrapiMediaUrl } from '@/services/api';
import { Link } from 'react-router-dom';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPostBySlug(slug || ''),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <ErrorMessage message="Failed to load the blog post. It may have been removed or doesn't exist." />
        </div>
      </Layout>
    );
  }

  const { attributes } = post;
  const coverImageUrl = getStrapiMediaUrl(attributes.coverImage?.data?.attributes?.url);
  const authorName = attributes.author?.data?.attributes?.name || 'Unknown Author';
  const authorId = attributes.author?.data?.id;
  const categories = attributes.categories?.data || [];
  const tags = attributes.tags?.data || [];
  const publishedDate = format(new Date(attributes.publishedAt), 'MMMM d, yyyy');

  return (
    <Layout>
      <article className="animate-fade-in">
        {/* Cover Image */}
        <div className="w-full h-72 md:h-96 bg-gray-100 overflow-hidden">
          <img 
            src={coverImageUrl} 
            alt={attributes.title}
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="container mx-auto px-4 -mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.attributes.slug}`}
                  className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {category.attributes.name}
                </Link>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {attributes.title}
            </h1>
            
            {/* Author & Date */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-x-4 gap-y-2">
              <Link 
                to={`/author/${authorId}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <User size={16} />
                <span>{authorName}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{publishedDate}</span>
              </div>
            </div>
            
            {/* Content */}
            <div 
              className="prose max-w-none blog-content mb-8"
              dangerouslySetInnerHTML={{ __html: attributes.content }}
            />
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag size={16} className="text-gray-500" />
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.attributes.slug}`}
                      className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag.attributes.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;
