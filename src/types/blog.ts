// Shared blog types and interfaces
export interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
  description?: string
}

export interface BlogAuthor {
  id: string
  name: string
  email: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  featured: boolean
  published: boolean
  views: number
  readTime: number
  publishedAt: string
  createdAt?: string
  updatedAt?: string
  author: BlogAuthor
  category: BlogCategory
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
}

export interface BlogApiResponse {
  success: boolean
  data: {
    posts: BlogPost[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
}

export interface BlogCardProps {
  post: BlogPost
  size?: 'small' | 'medium' | 'large'
  showExcerpt?: boolean
  showCategory?: boolean
  showAuthor?: boolean
  showFeaturedBadge?: boolean
  className?: string
}

export interface BlogSectionProps {
  title?: string
  subtitle?: string
  showViewAllButton?: boolean
  limit?: number
  featured?: boolean
  className?: string
}