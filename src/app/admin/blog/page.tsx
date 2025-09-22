'use client'

// React core imports
import { useState, useEffect } from 'react'

// UI component imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Icon imports
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search, 
  Filter,
  Save,
  X,
  Calendar,
  User,
  Tag,
  BarChart3
} from 'lucide-react'

// Custom component imports
import { MarkdownEditor } from '@/components/ui/markdown-editor'
import CategoryManager from '@/components/admin/CategoryManager'
import { useAuth } from '@/hooks/useAuth'

// Utility imports

// Simple toast replacement (TODO: Replace with proper toast system)
const toast = {
  success: (message: string) => alert(`Success: ${message}`),
  error: (message: string) => alert(`Error: ${message}`)
}

// Types and Interfaces
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  featured: boolean
  published: boolean | null
  views: number
  readTime: number
  publishedAt?: string
  createdAt: string
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
  }
  tags: string[]
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  postCount: number
}

interface BlogTag {
  id: string
  name: string
  slug: string
  postCount: number
}

interface FormData {
  title: string
  excerpt: string
  content: string
  imageUrl: string
  categoryId: string
  tagNames: string
  featured: boolean
  published: boolean
  readTime: number
  seoTitle: string
  seoDescription: string
}

export default function AdminBlogPage() {
  const { user, isLoading: authLoading } = useAuth()
  
  // UI State
  const [activeTab, setActiveTab] = useState('posts')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Data State
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Form State for create/edit operations
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    categoryId: '',
    tagNames: '',
    featured: false,
    published: true,
    readTime: 5,
    seoTitle: '',
    seoDescription: ''
  })

  // Constants
  const DEFAULT_ADMIN_ID = "cme2rxmib0000sbu6oi8fy62s" // VTU Admin fallback ID

  // Initialize data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // API: Fetch all blog-related data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/blog?published=all'),
        fetch('/api/blog/categories'),
        fetch('/api/blog/tags')
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.data.posts || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.data || [])
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        setTags(tagsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load blog data')
    } finally {
      setLoading(false)
    }
  }

  // Utility: Get current user ID with fallback strategies
  const getCurrentUserId = (): string | null => {
    // Primary: Use authenticated user ID
    if (user?.id) return user.id
    
    // Fallback 1: Try localStorage
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.id) return parsedUser.id
      }
    } catch (e) {
      console.error('Error parsing stored user:', e)
    }
    
    // Fallback 2: Default admin ID
    return DEFAULT_ADMIN_ID
  }

  // Utility: Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      categoryId: '',
      tagNames: '',
      featured: false,
      published: true,
      readTime: 5,
      seoTitle: '',
      seoDescription: ''
    })
  }

  // Utility: Start editing a post
  const startEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl || '',
      categoryId: post.category.id,
      tagNames: post.tags.join(', '),
      featured: post.featured,
      published: post.published !== false,
      readTime: post.readTime,
      seoTitle: '',
      seoDescription: ''
    })
  }

  // API: Create new blog post
  const handleCreatePost = async () => {
    try {
      const currentUserId = getCurrentUserId()
      
      if (!currentUserId) {
        toast.error('Authentication error: Unable to determine user ID')
        return
      }

      const requestBody = {
        ...formData,
        authorId: currentUserId,
        tags: formData.tagNames.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        toast.success('Blog post created successfully')
        setShowCreateModal(false)
        resetForm()
        fetchData()
      } else {
        const error = await response.json()
        console.error('API Error Response:', error)
        toast.error(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post - Network error')
    }
  }

  // API: Update existing blog post
  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      if (!user?.id) {
        toast.error('You must be logged in to update a blog post')
        return
      }

      const response = await fetch(`/api/blog/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authorId: user.id,
          tags: formData.tagNames.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })

      if (response.ok) {
        toast.success('Blog post updated successfully')
        setEditingPost(null)
        resetForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    }
  }

  // API: Delete blog post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Blog post deleted successfully')
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  // API: Toggle post visibility (active/archived)
  const handleToggleVisibility = async (postId: string, currentPublishedStatus: boolean | null) => {
    try {
      // Treat null as true (active/published) for the toggle logic
      const isCurrentlyActive = currentPublishedStatus !== false
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !isCurrentlyActive })
      })

      if (response.ok) {
        const action = !isCurrentlyActive ? 'activated' : 'archived'
        toast.success(`Blog post ${action} successfully`)
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update post status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to update post status')
    }
  }

  // Filter posts based on search term, category, and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category.id === selectedCategory
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.published !== false) ||
                         (statusFilter === 'draft' && post.published === false)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Component: Loading State
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )

  // Component: Authentication Required State
  const AuthRequired = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-4">You must be logged in to access the blog admin.</p>
        <Button onClick={() => window.location.href = '/login'} className="mt-4">
          Go to Login
        </Button>
      </div>
    </div>
  )

  // Component: Analytics Cards
  const AnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{posts.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {posts.filter(p => p.published).length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {posts.reduce((sum, post) => sum + post.views, 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
        </CardContent>
      </Card>
    </div>
  )

  // Early returns for loading and auth states
  if (loading || authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthRequired />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage blog posts, categories, and tags</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Posts Management Tab */}
        <TabsContent value="posts" className="space-y-6">
          {/* Search and Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Search Posts</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="min-w-[150px]">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[150px]">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Posts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Active</SelectItem>
                    <SelectItem value="draft">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {post.title}
                        {post.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        <Badge variant={post.published !== false ? "default" : "outline"}>
                          {post.published !== false ? 'Active' : 'Archived'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVisibility(post.id, post.published)}
                        title={post.published !== false ? 'Archive post' : 'Activate post'}
                      >
                        {post.published !== false ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views} views
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge 
                      variant="outline" 
                      style={{ backgroundColor: post.category.color + '20', borderColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories Management Tab */}
        <TabsContent value="categories" className="space-y-6">
          <CategoryManager onCategoryCreated={fetchData} />
        </TabsContent>

        {/* Tags Management Tab */}
        <TabsContent value="tags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Tags</CardTitle>
              <CardDescription>
                Manage blog post tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-sm">
                    {tag.name} ({tag.postCount})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsCards />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPost) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Post Information */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              {/* Content Section */}
              <div>
                <Label htmlFor="content">Content (Markdown)</Label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your blog post content in Markdown format..."
                  minHeight="500px"
                />
              </div>

              {/* Media Section */}
              <div>
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Read Time Section */}
              <div>
                <Label htmlFor="readTime">Read Time (minutes)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                  placeholder="5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Estimated time for readers to complete this blog post
                </p>
              </div>

              {/* Categorization Section */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Quick Category Creation */}
                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                  <CategoryManager compact={true} onCategoryCreated={fetchData} />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tagNames}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagNames: e.target.value }))}
                  placeholder="react, javascript, tutorial"
                />
              </div>

              {/* Publishing Options */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publish Now</Label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingPost ? handleUpdatePost : handleCreatePost}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingPost ? 'Update' : 'Create'} Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}