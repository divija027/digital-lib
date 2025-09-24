import Link from 'next/link'
import { BlogSectionProps } from '@/types/blog'
import { useHomeBlogPosts } from '@/hooks/useBlogPosts'
import BlogCard from './BlogCard'
import BlogCardSkeleton from './BlogCardSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BlogSection: React.FC<BlogSectionProps> = ({
  title = "From Our Learning Blog",
  subtitle = "Stay updated with study tips, career guidance, and the latest trends in engineering education",
  showViewAllButton = true,
  className
}) => {
  const { posts, loading, error } = useHomeBlogPosts()

  return (
    <section className={cn(
      "py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50/30 relative overflow-hidden",
      className
    )}>
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-green-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50/80 mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm">
            <BookOpen className="w-3 h-3 mr-1 sm:mr-2" />
            <span>Latest Insights</span>
          </Badge>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2 sm:px-3 md:px-0 leading-tight">
            <span className="text-green-600">{title.split(' ').slice(0, 2).join(' ')}</span>{' '}
            <span>{title.split(' ').slice(2).join(' ')}</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light px-3 sm:px-4 md:px-6 lg:px-0 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
          {loading ? (
            <BlogCardSkeleton count={3} />
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-500 mb-2">Error loading blog posts</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                size="medium"
                showExcerpt={true}
                showCategory={true}
                showFeaturedBadge={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No blog posts available</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {showViewAllButton && (
          <div className="text-center">
            <Link href="/blog">
              <Button variant="outline" className="bg-white/80 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-md">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Weekly updates • Study tips • Career guidance
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogSection