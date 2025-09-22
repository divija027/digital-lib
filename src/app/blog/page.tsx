'use client'

// React core imports
import { useState, useEffect } from 'react'
import Link from 'next/link'

// UI component imports
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Icon imports
import { 
  Search, 
  User, 
  Clock, 
  BookOpen,
  Filter,
  TrendingUp,
  Eye,
  ChevronRight,
  Tag
} from 'lucide-react'

// Types
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  author: {
    id: string
    name: string
    email: string
  }
  category: {
    id: string
    name: string
    slug: string
    color: string
    description?: string
    createdAt: string
    updatedAt: string
  }
  tags: string[]
  publishedAt: string
  readTime: number
  views: number
  featured: boolean
  imageUrl?: string
}

interface Category {
  name: string
  slug: string
  count: number
}

export default function BlogPage() {
  // State management
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Constants
  const postsPerPage = 9

  // API: Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/blog')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setBlogPosts(data.data.posts)
            setFilteredPosts(data.data.posts)
          }
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Get unique categories with post counts
  const categories: Category[] = [
    { name: 'All', slug: 'all', count: blogPosts.length },
    ...Array.from(new Set(blogPosts.map(post => post.category.slug)))
      .map(slug => {
        const category = blogPosts.find(post => post.category.slug === slug)?.category
        const count = blogPosts.filter(post => post.category.slug === slug).length
        return { name: category?.name || '', slug, count }
      })
  ]

  // Filter posts based on search query and selected category
  useEffect(() => {
    let filtered = blogPosts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.slug === selectedCategory)
    }

    setFilteredPosts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedCategory, blogPosts])

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  // Featured posts (limit to 2 for better layout)
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2)

  // Component: Featured Post Card
  const FeaturedPostCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blog/${post.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white opacity-60" />
          </div>
          <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
            Featured
          </Badge>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              style={{ backgroundColor: post.category.color, color: 'white' }}
              className="text-white"
            >
              {post.category.name}
            </Badge>
            <span className="text-sm text-gray-500">
              {post.readTime} min read
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-200">
              Read More <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  // Component: Regular Post Card
  const RegularPostCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blog/${post.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              style={{ backgroundColor: post.category.color, color: 'white' }}
              className="text-white"
            >
              {post.category.name}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">{post.author.name}</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-200">
            Read More <ChevronRight className="w-3 h-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  // Component: Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
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
            <LoadingSkeleton />
          ) : currentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <RegularPostCard key={post.id} post={post} />
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