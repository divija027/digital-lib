import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/[id]/related - Fetch related blog posts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '3')

    // First, get the current post to find related posts based on category and tags
    const currentPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!currentPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get related posts based on category and tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { id: { not: postId } }, // Exclude current post
          { published: true }, // Only published posts
          {
            OR: [
              { categoryId: currentPost.categoryId }, // Same category
              {
                tags: {
                  some: {
                    tagId: {
                      in: currentPost.tags.map(pt => pt.tagId)
                    }
                  }
                }
              } // Posts with similar tags
            ]
          }
        ]
      },
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
      take: limit
    })

    // If we don't have enough related posts, fill with latest posts
    if (relatedPosts.length < limit) {
      const additionalPosts = await prisma.blogPost.findMany({
        where: {
          AND: [
            { id: { not: postId } },
            { published: true },
            {
              id: {
                notIn: relatedPosts.map(post => post.id)
              }
            }
          ]
        },
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
          { publishedAt: 'desc' }
        ],
        take: limit - relatedPosts.length
      })

      relatedPosts.push(...additionalPosts)
    }

    // Format the response
    const formattedPosts = relatedPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      featured: post.featured,
      views: post.views,
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category,
      tags: post.tags.map(pt => pt.tag.name)
    }))

    return NextResponse.json({
      success: true,
      data: formattedPosts
    })
  } catch (error) {
    console.error('Error fetching related blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related blog posts' },
      { status: 500 }
    )
  }
}