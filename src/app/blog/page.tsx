'use client'

// React core imports
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

// UI component imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Icon imports
import { 
  Search, 
  BookOpen,
  Filter,
  TrendingUp
} from 'lucide-react'

// Custom components and hooks
import { BlogCard, BlogCardSkeleton } from '@/components/blog'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import { BlogPost } from '@/types/blog'

interface Category {
  name: string
  slug: string
  count: number
}

export default function BlogPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Constants
  const postsPerPage = 9

  // Fetch all blog posts
  const { posts: allPosts, loading: isLoading, error } = useBlogPosts({ 
    limit: 100, // Get all posts for client-side filtering
    autoFetch: true 
  })

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    let filtered = allPosts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.slug === selectedCategory)
    }

    return filtered
  }, [allPosts, searchQuery, selectedCategory])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Get unique categories with post counts
  const categories: Category[] = useMemo(() => [
    { name: 'All', slug: 'all', count: allPosts.length },
    ...Array.from(new Set(allPosts.map(post => post.category.slug)))
      .map(slug => {
        const category = allPosts.find(post => post.category.slug === slug)?.category
        const count = allPosts.filter(post => post.category.slug === slug).length
        return { name: category?.name || '', slug, count }
      })
  ], [allPosts])

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  // Featured posts (limit to 3 for better layout)
  const featuredPosts = allPosts.filter(post => post.featured).slice(0, 3)

  // Component: Empty State
  const EmptyState = () => (
    <div className="text-center py-12">
      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              BrainReef Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Insights, tips, and resources for VTU students to excel in their academic journey
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  size="large"
                  showExcerpt={true}
                  showCategory={true}
                  showFeaturedBadge={true}
                  showAuthor={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredPosts.length} posts found
              </span>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
                className="gap-1"
              >
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid Section */}
        <section>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BlogCardSkeleton count={9} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-red-600 mb-2">Error loading posts</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : currentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  size="medium"
                  showExcerpt={true}
                  showCategory={true}
                  showFeaturedBadge={false}
                  showAuthor={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <section className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}