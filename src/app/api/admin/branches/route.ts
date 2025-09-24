import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VTU_CURRICULUM, FIRST_YEAR_CYCLES } from '@/lib/vtu-curriculum'

// Create a branches in categories table if they don't exist
async function ensureBranchesExist() {
  // Check if we have any branches in database
  const existingBranches = await prisma.category.findMany({
    where: {
      name: {
        in: [...VTU_CURRICULUM.map(b => b.code), ...FIRST_YEAR_CYCLES.map(c => c.code)]
      }
    }
  })

  const existingCodes = existingBranches.map(b => b.name)
  
  // Create missing branches from VTU curriculum
  const missingBranches = VTU_CURRICULUM.filter(branch => !existingCodes.includes(branch.code))
  const missingCycles = FIRST_YEAR_CYCLES.filter(cycle => !existingCodes.includes(cycle.code))

  for (const branch of missingBranches) {
    await prisma.category.create({
      data: {
        name: branch.code,
        description: JSON.stringify({
          fullName: branch.fullName,
          icon: branch.icon,
          color: branch.color,
          isActive: true,
          order: VTU_CURRICULUM.indexOf(branch),
          type: 'branch',
          originalDescription: branch.description
        })
      }
    })
  }

  for (const cycle of missingCycles) {
    await prisma.category.create({
      data: {
        name: cycle.code,
        description: JSON.stringify({
          fullName: cycle.fullName,
          icon: cycle.icon,
          color: cycle.color,
          isActive: true,
          order: FIRST_YEAR_CYCLES.indexOf(cycle) + 100,
          type: 'cycle',
          originalDescription: cycle.description
        })
      }
    })
  }
}

export async function GET() {
  try {
    // Ensure branches exist in database
    await ensureBranchesExist()

    // Get all categories that are marked as branches or cycles
    const branchCategories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' }
    })

    // Filter and transform branches
    const branches = branchCategories
      .map(category => {
        const curriculumBranch = VTU_CURRICULUM.find(b => b.code === category.name) ||
                                 FIRST_YEAR_CYCLES.find(c => c.code === category.name)
        
        let metadata: Record<string, unknown> = { isActive: true, order: 999, type: 'branch' }
        try {
          if (category.description) {
            const parsed = JSON.parse(category.description)
            metadata = { ...metadata, ...parsed }
          }
        } catch {
          // If JSON parsing fails, treat as regular description
          metadata.originalDescription = category.description
        }

        // Only include if it's a branch or cycle type, or if it's in VTU curriculum
        const isBranchType = metadata.type === 'branch' || metadata.type === 'cycle'
        const isVTUBranch = curriculumBranch !== undefined
        
        if (!isBranchType && !isVTUBranch) {
          return null
        }

        return {
          id: category.id,
          name: metadata.fullName || curriculumBranch?.fullName || category.name,
          code: category.name,
          description: metadata.originalDescription || curriculumBranch?.description || '',
          icon: metadata.icon || curriculumBranch?.icon || '📚',
          color: metadata.color || curriculumBranch?.color || 'from-gray-500 to-gray-600',
          isActive: metadata.isActive !== false,
          order: typeof metadata.order === 'number' ? metadata.order : (VTU_CURRICULUM.findIndex(b => b.code === category.name) + 1),
          type: metadata.type || 'branch',
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      })
      .filter(branch => branch !== null) // Remove null entries

    return Response.json({
      success: true,
      branches: branches.sort((a, b) => a.order - b.order)
    })

  } catch (error) {
    console.error('Failed to fetch branches:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch branches' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, code, description, icon, color } = await request.json()

    if (!name || !code) {
      return Response.json({ success: false, error: 'Name and code are required' }, { status: 400 })
    }

    // Check if branch already exists
    const existingBranch = await prisma.category.findFirst({
      where: { name: code.toUpperCase() }
    })

    if (existingBranch) {
      return Response.json({ success: false, error: 'Branch code already exists' }, { status: 409 })
    }

    // Create new branch
    const newBranch = await prisma.category.create({
      data: {
        name: code.toUpperCase(),
        description: JSON.stringify({
          fullName: name,
          icon: icon || '📚',
          color: color || 'from-gray-500 to-gray-600',
          isActive: true,
          order: 999, // Put new branches at the end
          type: 'branch',
          originalDescription: description || `${name} Engineering`
        })
      }
    })

    return Response.json({
      success: true,
      branch: {
        id: newBranch.id,
        name,
        code: code.toUpperCase(),
        description,
        icon: icon || '📚',
        color: color || 'from-gray-500 to-gray-600',
        isActive: true,
        order: 999,
        type: 'branch',
        createdAt: newBranch.createdAt,
        updatedAt: newBranch.updatedAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create branch:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to create branch' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, code, description, icon, color, isActive, order } = await request.json()

    if (!id) {
      return Response.json({ success: false, error: 'Branch ID is required' }, { status: 400 })
    }

    // Get current category
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return Response.json({ success: false, error: 'Branch not found' }, { status: 404 })
    }

    // Parse existing metadata
    let metadata: Record<string, unknown> = {}
    try {
      if (category.description) {
        metadata = JSON.parse(category.description)
      }
    } catch {
      metadata = { originalDescription: category.description }
    }

    // Update metadata with provided fields
    if (name) metadata.fullName = name
    if (icon) metadata.icon = icon
    if (color) metadata.color = color
    if (description) metadata.originalDescription = description
    if (typeof isActive !== 'undefined') metadata.isActive = isActive
    if (typeof order !== 'undefined') metadata.order = order

    // Update the category name if code is provided
    const updateData: Record<string, unknown> = {
      description: JSON.stringify(metadata)
    }

    // If code is being updated, update the category name
    if (code && code.toUpperCase() !== category.name) {
      // Check if new code already exists
      const existingBranch = await prisma.category.findFirst({
        where: { 
          name: code.toUpperCase(),
          id: { not: id }
        }
      })

      if (existingBranch) {
        return Response.json({ 
          success: false, 
          error: 'Branch code already exists' 
        }, { status: 409 })
      }

      updateData.name = code.toUpperCase()
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData
    })

    return Response.json({
      success: true,
      branch: {
        id: updatedCategory.id,
        name: metadata.fullName || updatedCategory.name,
        code: updatedCategory.name,
        description: metadata.originalDescription || '',
        icon: metadata.icon || '📚',
        color: metadata.color || 'from-gray-500 to-gray-600',
        isActive: metadata.isActive !== false,
        order: metadata.order || 0,
        type: metadata.type || 'branch',
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt
      }
    })

  } catch (error) {
    console.error('Failed to update branch:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to update branch' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const permanent = searchParams.get('permanent') === 'true'

    if (!id) {
      return Response.json({ success: false, error: 'Branch ID is required' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return Response.json({ success: false, error: 'Branch not found' }, { status: 404 })
    }

    if (permanent) {
      // Permanently delete the branch
      await prisma.category.delete({
        where: { id }
      })

      return Response.json({
        success: true,
        message: 'Branch permanently deleted'
      })
    } else {
      // Mark as inactive (soft delete)
      let metadata: Record<string, unknown> = {}
      try {
        if (category.description) {
          metadata = JSON.parse(category.description)
        }
      } catch {
        metadata = { originalDescription: category.description }
      }

      // Mark as inactive
      metadata.isActive = false

      await prisma.category.update({
        where: { id },
        data: {
          description: JSON.stringify(metadata)
        }
      })

      return Response.json({
        success: true,
        message: 'Branch deactivated successfully'
      })
    }

  } catch (error) {
    console.error('Failed to delete branch:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to delete branch' 
    }, { status: 500 })
  }
}
