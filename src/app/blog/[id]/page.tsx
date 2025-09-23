'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { 
  ArrowLeft,
  Calendar, 
  User, 
  Clock, 
  Eye,
  Share2,
  BookOpen,
  ChevronRight,
  Tag,
  ExternalLink
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    email: string
    role?: string
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
  updatedAt: string
  readTime: number
  views: number
  featured: boolean
  imageUrl?: string
  seoTitle?: string
  seoDescription?: string
}

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  category: {
    id: string
    name: string
    color: string
  }
  readTime: number
  publishedAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [relatedPostsLoading, setRelatedPostsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch(`/api/blog/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setBlogPost(data.data)
          } else {
            console.error('Failed to fetch blog post:', data.error)
          }
        } else {
          console.error('Failed to fetch blog post:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchRelatedPosts = async () => {
      try {
        setRelatedPostsLoading(true)
        const response = await fetch(`/api/blog/${params.id}/related?limit=3`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setRelatedPosts(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setRelatedPostsLoading(false)
      }
    }

    if (params.id) {
      fetchBlogPost()
      fetchRelatedPosts()
    }
  }, [params.id])

  const handleShare = async () => {
    if (navigator.share && blogPost) {
      try {
        await navigator.share({
          title: blogPost.title,
          text: blogPost.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="h-64 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={blogPost.category.color}>
                {blogPost.category.name}
              </Badge>
              {blogPost.featured && (
                <Badge className="bg-orange-100 text-orange-800">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blogPost.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {blogPost.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{blogPost.author.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.publishedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blogPost.readTime} min read</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blogPost.views} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* Featured Image */}
            {blogPost.imageUrl ? (
              <img 
                src={blogPost.imageUrl} 
                alt={blogPost.title}
                className="h-64 md:h-80 w-full object-cover rounded-lg mb-8"
              />
            ) : (
              <div className="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-8">
                <BookOpen className="w-16 h-16 text-white opacity-60" />
              </div>
            )}
          </header>

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <MarkdownRenderer content={blogPost.content} />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {blogPost.author.name}
                  </h3>
                  <p className="text-gray-600">
                    Author: {blogPost.author.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            {relatedPostsLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : relatedPosts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{post.category.name}</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button size="sm" className="w-full gap-1">
                          Read More <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No related posts found</p>
                <Link href="/blog" className="inline-block mt-4">
                  <Button variant="outline" size="sm">
                    Explore All Posts
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </article>
      </div>
    </div>
  )
}