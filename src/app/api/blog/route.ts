import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog - Fetch all blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const publishedParam = searchParams.get('published')
    const published = publishedParam === 'false' ? false : publishedParam !== 'all' // Default to true, unless explicitly false or 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // Only filter by published status if not requesting all posts
    if (publishedParam !== 'all') {
      where.published = published
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } }
      ]
    }

    if (featured) {
      where.featured = true
    }

    // Fetch posts with relations
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    // Format the response
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      featured: post.featured,
      published: post.published,
      views: post.views,
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category,
      tags: post.tags.map(pt => pt.tag.name)
    }))

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create a new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      imageUrl,
      categoryId,
      tags = [],
      featured = false,
      published = false,
      authorId,
      readTime,
      seoTitle,
      seoDescription
    } = body

    // Validate required fields
    if (!title || !excerpt || !content || !categoryId || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this title already exists' },
        { status: 409 }
      )
    }

    // Use provided readTime or calculate read time (average 200 words per minute)
    let finalReadTime = readTime
    if (!finalReadTime || finalReadTime <= 0) {
      const wordCount = content.split(/\s+/).length
      finalReadTime = Math.ceil(wordCount / 200)
    }

    // Create the blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        featured,
        published,
        readTime: finalReadTime,
        seoTitle,
        seoDescription,
        publishedAt: published ? new Date() : null,
        authorId,
        categoryId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    })

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.blogTag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          const tagSlug = tagName
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()

          tag = await prisma.blogTag.create({
            data: {
              name: tagName,
              slug: tagSlug
            }
          })
        }

        // Create post-tag relation
        await prisma.blogPostTag.create({
          data: {
            postId: blogPost.id,
            tagId: tag.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: blogPost
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}