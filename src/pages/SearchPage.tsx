
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/ui/PostCard';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchLatestPosts, StrapiData, BlogPost } from '@/services/api';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StrapiData<BlogPost>[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => fetchLatestPosts(100), // Fetch a large number of posts for search
  });

  const allPosts = data?.data || [];

  // Handle search when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = allPosts.filter((post) => {
        const title = post.attributes.title.toLowerCase();
        const content = post.attributes.content.toLowerCase();
        const term = searchTerm.toLowerCase();
        return title.includes(term) || content.includes(term);
      });
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, allPosts]);

  return (
    <Layout>
      <PageHeader title="Search Articles" />

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-12 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message="Failed to load posts. Please try again later." />
        ) : searchTerm ? (
          isSearching ? (
            <LoadingSpinner />
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No articles found for "{searchTerm}".</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">{searchResults.length} results found for "{searchTerm}"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Enter a search term to find articles.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
