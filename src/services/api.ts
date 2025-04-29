
import axios from 'axios';

// Configure the base URL for the Strapi API
const STRAPI_URL = 'http://localhost:1337'; // Change this to your actual Strapi API URL

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

// Helper function to resolve Strapi media URLs
export const getStrapiMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http') || url.startsWith('https')) return url;
  return `${STRAPI_URL}${url}`;
};

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: StrapiData<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText?: string;
    };
  } | null;
}

export interface StrapiAuthor {
  data: {
    id: number;
    attributes: {
      name: string;
      bio?: string;
      avatar?: StrapiMedia;
    };
  };
}

export interface StrapiCategory {
  data: {
    id: number;
    attributes: {
      name: string;
      slug: string;
    };
  };
}

export interface StrapiTag {
  data: {
    id: number;
    attributes: {
      name: string;
      slug: string;
    };
  };
}

export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  coverImage: StrapiMedia;
  author: StrapiAuthor;
  categories: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
        slug: string;
      };
    }>;
  };
  tags?: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
        slug: string;
      };
    }>;
  };
}

// API functions
export const fetchLatestPosts = async (limit = 6) => {
  try {
    const response = await api.get<StrapiResponse<BlogPost>>(
      `/posts?populate=coverImage,author,categories&sort=publishedAt:desc&pagination[limit]=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};

export const fetchPostBySlug = async (slug: string) => {
  try {
    const response = await api.get<StrapiResponse<BlogPost>>(
      `/posts?filters[slug][$eq]=${slug}&populate=author,coverImage,tags,categories`
    );
    
    if (response.data.data.length === 0) {
      throw new Error("Post not found");
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
};

export const fetchPostsByCategory = async (categorySlug: string, limit = 10) => {
  try {
    const response = await api.get<StrapiResponse<BlogPost>>(
      `/posts?filters[categories][slug][$eq]=${categorySlug}&populate=author,coverImage,categories&pagination[limit]=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    throw error;
  }
};

export const fetchPostsByAuthor = async (authorId: number, limit = 10) => {
  try {
    const response = await api.get<StrapiResponse<BlogPost>>(
      `/posts?filters[author][id][$eq]=${authorId}&populate=coverImage,categories&pagination[limit]=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for author ${authorId}:`, error);
    throw error;
  }
};

export const fetchPostsByTag = async (tagSlug: string, limit = 10) => {
  try {
    const response = await api.get<StrapiResponse<BlogPost>>(
      `/posts?filters[tags][slug][$eq]=${tagSlug}&populate=author,coverImage,categories&pagination[limit]=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagSlug}:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get<StrapiResponse<{ name: string; slug: string }>>(
      '/categories?sort=name:asc'
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export default api;
