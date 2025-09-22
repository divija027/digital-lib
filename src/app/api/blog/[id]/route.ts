import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/[id] - Fetch a single blog post by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    const blogPost = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: blogPost.id },
      data: { views: { increment: 1 } }
    })

    // Format the response
    const formattedPost = {
      id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      imageUrl: blogPost.imageUrl,
      featured: blogPost.featured,
      views: blogPost.views + 1, // Include the incremented view
      readTime: blogPost.readTime,
      publishedAt: blogPost.publishedAt,
      updatedAt: blogPost.updatedAt,
      seoTitle: blogPost.seoTitle,
      seoDescription: blogPost.seoDescription,
      author: blogPost.author,
      category: blogPost.category,
      tags: blogPost.tags.map(pt => pt.tag.name)
    }

    return NextResponse.json({
      success: true,
      data: formattedPost
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[id] - Update a blog post (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      imageUrl,
      categoryId,
      tags = [],
      featured,
      published,
      readTime,
      seoTitle,
      seoDescription
    } = body

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let slug = existingPost.slug
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      // Check if new slug already exists
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })

      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Use provided readTime or calculate if content changed
    let finalReadTime = existingPost.readTime
    if (readTime !== undefined && readTime > 0) {
      finalReadTime = readTime
    } else if (content && content !== existingPost.content) {
      const wordCount = content.split(/\s+/).length
      finalReadTime = Math.ceil(wordCount / 200)
    }

    // Update the blog post
    const updateData: any = {
      updatedAt: new Date()
    }

    if (title) updateData.title = title
    if (excerpt) updateData.excerpt = excerpt
    if (content) updateData.content = content
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (categoryId) updateData.categoryId = categoryId
    if (featured !== undefined) updateData.featured = featured
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription
    if (finalReadTime !== existingPost.readTime) updateData.readTime = finalReadTime
    if (slug !== existingPost.slug) updateData.slug = slug

    // Handle published status and publishedAt
    if (published !== undefined) {
      updateData.published = published
      if (published && !existingPost.published) {
        updateData.publishedAt = new Date()
      } else if (!published) {
        updateData.publishedAt = null
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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
      }
    })

    // Handle tags update
    if (tags.length >= 0) {
      // Remove existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: id }
      })

      // Add new tags
      for (const tagName of tags) {
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

        await prisma.blogPostTag.create({
          data: {
            postId: id,
            tagId: tag.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedPost
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id] - Delete a blog post (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Delete the blog post (this will cascade delete related records)
    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}