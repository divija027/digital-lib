import Link from 'next/link'
import { BlogCardProps } from '@/types/blog'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  size = 'medium',
  showExcerpt = true,
  showCategory = true,
  showAuthor = false,
  showFeaturedBadge = true,
  className
}) => {
  const sizeClasses = {
    small: 'p-3 sm:p-4',
    medium: 'p-4 sm:p-5 md:p-6',
    large: 'p-6 sm:p-7 md:p-8'
  }

  const imageHeightClasses = {
    small: 'h-24 sm:h-28',
    medium: 'h-32 sm:h-36 md:h-40',
    large: 'h-40 sm:h-44 md:h-48'
  }

  const titleClasses = {
    small: 'text-sm sm:text-base',
    medium: 'text-sm sm:text-base md:text-lg',
    large: 'text-base sm:text-lg md:text-xl'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/blog/${post.id}`}>
      <div className={cn(
        "bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300",
        "border border-gray-100 hover:border-blue-200 group cursor-pointer hover:-translate-y-1",
        sizeClasses[size],
        className
      )}>
        <div className="relative mb-4">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className={cn(
                "w-full object-cover rounded-xl sm:rounded-2xl",
                imageHeightClasses[size]
              )}
            />
          ) : (
            <div className={cn(
              "w-full rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200",
              imageHeightClasses[size]
            )}>
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
          )}
          
          {showCategory && (
            <Badge 
              className="absolute top-2 left-2 text-xs"
              style={{ backgroundColor: post.category.color, color: 'white' }}
            >
              {post.category.name}
            </Badge>
          )}
          
          {showFeaturedBadge && post.featured && (
            <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
              ⭐ Featured
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <h3 className={cn(
            "font-bold text-gray-900 transition-colors leading-tight line-clamp-2",
            "group-hover:text-blue-600",
            titleClasses[size]
          )}>
            {post.title}
          </h3>
          
          {showExcerpt && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{post.readTime} min read</span>
            <span>
              {post.featured && showFeaturedBadge ? 
                '⭐ Featured' : 
                formatDate(post.publishedAt)
              }
            </span>
          </div>
          
          {showAuthor && (
            <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
              By {post.author.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default BlogCard