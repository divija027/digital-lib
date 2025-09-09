import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { branches } = body

    console.log('Received reorder request:', body) // Debug log

    if (!branches || !Array.isArray(branches)) {
      console.log('Invalid branches data:', branches) // Debug log
      return Response.json({ 
        success: false, 
        error: 'Invalid branches data - expected array of branches' 
      }, { status: 400 })
    }

    if (branches.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No branches provided for reordering' 
      }, { status: 400 })
    }

    let updatedCount = 0

    // Update each branch with new order
    for (const branchData of branches) {
      const { id, order } = branchData

      if (!id) {
        console.log('Skipping branch without id:', branchData)
        continue
      }

      if (typeof order !== 'number') {
        console.log('Skipping branch with invalid order:', branchData)
        continue
      }

      // Get current category
      const category = await prisma.category.findUnique({
        where: { id }
      })

      if (!category) {
        console.log('Category not found for id:', id)
        continue
      }

      // Parse existing metadata
      let metadata: any = {}
      try {
        if (category.description) {
          metadata = JSON.parse(category.description)
        }
      } catch (e) {
        metadata = { originalDescription: category.description }
      }

      // Update order
      metadata.order = order

      // Update category
      await prisma.category.update({
        where: { id },
        data: {
          description: JSON.stringify(metadata)
        }
      })

      updatedCount++
    }

    console.log(`Successfully updated ${updatedCount} branches`) // Debug log

    return Response.json({
      success: true,
      message: `Branch order updated successfully. Updated ${updatedCount} branches.`,
      updatedCount
    })

  } catch (error) {
    console.error('Failed to reorder branches:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to reorder branches: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}
