
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { StrapiData, BlogPost, getStrapiMediaUrl } from '@/services/api';

interface PostCardProps {
  post: StrapiData<BlogPost>;
}

const PostCard = ({ post }: PostCardProps) => {
  const { attributes } = post;
  const coverImageUrl = getStrapiMediaUrl(attributes.coverImage?.data?.attributes?.url);
  const authorName = attributes.author?.data?.attributes?.name || 'Unknown Author';
  const categories = attributes.categories?.data || [];
  
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover-scale">
      <Link to={`/blog/${attributes.slug}`} className="block">
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={coverImageUrl}
            alt={attributes.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
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
        
        <Link to={`/blog/${attributes.slug}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {attributes.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {attributes.excerpt || attributes.content.substring(0, 150) + '...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Link 
            to={`/author/${attributes.author.data.id}`}
            className="font-medium hover:text-blue-600 transition-colors"
          >
            {authorName}
          </Link>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{format(new Date(attributes.publishedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
