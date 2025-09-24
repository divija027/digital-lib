import { useState, useEffect } from 'react'
import { BlogPost, BlogApiResponse } from '@/types/blog'

interface UseBlogPostsOptions {
  limit?: number
  featured?: boolean
  category?: string
  search?: string
  published?: boolean | 'all'
  autoFetch?: boolean
}

interface UseBlogPostsReturn {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  hasMore: boolean
}

export const useBlogPosts = (options: UseBlogPostsOptions = {}): UseBlogPostsReturn => {
  const {
    limit = 10,
    featured,
    category,
    search,
    published = true,
    autoFetch = true
  } = options

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      
      if (featured !== undefined) {
        params.append('featured', featured.toString())
      }
      
      if (category) {
        params.append('category', category)
      }
      
      if (search) {
        params.append('search', search)
      }
      
      if (published !== undefined) {
        params.append('published', published.toString())
      }

      const response = await fetch(`/api/blog?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }

      const data: BlogApiResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch posts')
      }

      setPosts(data.data.posts)
      
      // Update hasMore based on pagination info
      if (data.data.pagination) {
        const { page, totalPages } = data.data.pagination
        setHasMore(page < totalPages)
      } else {
        setHasMore(false)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchPosts()
    }
  }, [limit, featured, category, search, published, autoFetch])

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    hasMore
  }
}

// Hook specifically for home page blog preview with fallback posts
export const useHomeBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fallbackPosts: BlogPost[] = [
    {
      id: 'fallback-1',
      title: 'How to Prepare for VTU Exams: A Complete Guide',
      slug: 'vtu-exam-preparation-guide',
      excerpt: 'Master your VTU examinations with proven strategies, time management tips, and effective study techniques used by top performers.',
      content: '',
      readTime: 5,
      featured: false,
      published: true,
      views: 0,
      publishedAt: new Date().toISOString(),
      author: { id: '1', name: 'BrainReef Team', email: 'team@brainreef.com' },
      category: { id: '1', name: 'Study Tips', slug: 'study-tips', color: '#10b981' }
    },
    {
      id: 'fallback-2',
      title: 'Top Tech Companies Hiring VTU Graduates in 2025',
      slug: 'tech-companies-hiring-vtu-graduates-2025',
      excerpt: 'Discover the latest opportunities and what top tech companies are looking for in fresh engineering graduates.',
      content: '',
      readTime: 7,
      featured: false,
      published: true,
      views: 0,
      publishedAt: new Date().toISOString(),
      author: { id: '1', name: 'BrainReef Team', email: 'team@brainreef.com' },
      category: { id: '2', name: 'Career', slug: 'career', color: '#3b82f6' }
    },
    {
      id: 'fallback-3',
      title: 'AI and Machine Learning: Essential Skills for Engineers',
      slug: 'ai-ml-essential-skills-engineers',
      excerpt: 'Learn about the most in-demand skills in AI and ML that every engineering student should know about.',
      content: '',
      readTime: 8,
      featured: false,
      published: true,
      views: 0,
      publishedAt: new Date().toISOString(),
      author: { id: '1', name: 'BrainReef Team', email: 'team@brainreef.com' },
      category: { id: '3', name: 'Technology', slug: 'technology', color: '#8b5cf6' }
    }
  ]

  const fetchHomePosts = async () => {
    try {
      setLoading(true)
      setError(null)

      let finalPosts: BlogPost[] = []

      // First try to get featured posts
      const featuredResponse = await fetch('/api/blog?limit=3&featured=true')
      
      if (featuredResponse.ok) {
        const featuredData: BlogApiResponse = await featuredResponse.json()
        if (featuredData.success && featuredData.data.posts.length > 0) {
          finalPosts = featuredData.data.posts
        }
      }

      // If we don't have enough featured posts, fill with recent posts
      if (finalPosts.length < 3) {
        const recentResponse = await fetch('/api/blog?limit=10')
        if (recentResponse.ok) {
          const recentData: BlogApiResponse = await recentResponse.json()
          if (recentData.success) {
            // Filter out posts we already have
            const newPosts = recentData.data.posts.filter(
              (newPost: BlogPost) => !finalPosts.some((existingPost: BlogPost) => existingPost.id === newPost.id)
            )
            finalPosts = [...finalPosts, ...newPosts].slice(0, 3)
          }
        }
      }

      // If we still don't have 3 posts, add fallback posts
      if (finalPosts.length < 3) {
        const neededFallbacks = fallbackPosts.slice(0, 3 - finalPosts.length)
        finalPosts = [...finalPosts, ...neededFallbacks]
      }

      setPosts(finalPosts.slice(0, 3)) // Ensure exactly 3 posts

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Error fetching home blog posts:', err)
      // On error, use fallback posts
      setPosts(fallbackPosts.slice(0, 3))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomePosts()
  }, [])

  return {
    posts,
    loading,
    error,
    refetch: fetchHomePosts
  }
}