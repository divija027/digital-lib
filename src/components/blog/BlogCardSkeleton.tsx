import { cn } from '@/lib/utils'

interface BlogCardSkeletonProps {
  size?: 'small' | 'medium' | 'large'
  count?: number
  className?: string
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  size = 'medium',
  count = 1,
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

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            "bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 animate-pulse",
            sizeClasses[size],
            className
          )}
        >
          <div className="relative mb-4">
            <div className={cn(
              "w-full bg-gray-200 rounded-xl sm:rounded-2xl",
              imageHeightClasses[size]
            )} />
            <div className="absolute top-2 left-2 w-16 h-6 bg-gray-200 rounded" />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default BlogCardSkeleton