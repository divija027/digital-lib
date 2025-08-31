import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { resources: true }
        }
      }
    })

    // Group subjects by branch (extracting from subject names/codes)
    const branches = subjects.reduce((acc, subject) => {
      // Simple branch extraction logic - you might need to adjust this
      const branchCode = subject.code.substring(0, 2) // First 2 chars as branch code
      const branchName = getBranchName(branchCode)
      
      if (!acc[branchCode]) {
        acc[branchCode] = {
          id: branchCode,
          name: branchName,
          code: branchCode,
          description: `${branchName} Engineering`,
          color: getBranchColor(branchCode),
          icon: getBranchIcon(branchCode),
          subjects: [],
          resourceCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      
      acc[branchCode].subjects.push(subject)
      acc[branchCode].resourceCount += subject._count.resources
      
      return acc
    }, {} as Record<string, any>)

    return Response.json(Object.values(branches))

  } catch (error) {
    console.error('Branches API error:', error)
    return createAdminResponse('Failed to fetch branches', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { name, code, description, color, icon } = body

    // Validate required fields
    if (!name || !code) {
      return createAdminResponse('Name and code are required', 400)
    }

    // For now, we'll create this as metadata since we don't have a branches table
    // In a real implementation, you'd want to add a branches table to the schema
    const branchData = {
      name,
      code: code.toUpperCase(),
      description,
      color: color || '#3b82f6',
      icon: icon || 'BookOpen',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // This is a mock response - in reality you'd save to a branches table
    return Response.json({
      id: `branch_${Date.now()}`,
      ...branchData,
      subjects: [],
      resourceCount: 0,
      isActive: true
    }, { status: 201 })

  } catch (error) {
    console.error('Create branch API error:', error)
    return createAdminResponse('Failed to create branch', 500)
  }
}

function getBranchName(code: string): string {
  const branchNames: Record<string, string> = {
    'CS': 'Computer Science',
    'EC': 'Electronics & Communication',
    'ME': 'Mechanical',
    'CE': 'Civil',
    'EE': 'Electrical',
    'CH': 'Chemical',
    'BT': 'Biotechnology',
    'AU': 'Automobile',
    'AE': 'Aeronautical',
    'IT': 'Information Technology'
  }
  
  return branchNames[code] || 'Other'
}

function getBranchColor(code: string): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const index = code.charCodeAt(0) % colors.length
  return colors[index]
}

function getBranchIcon(code: string): string {
  const icons: Record<string, string> = {
    'CS': 'Monitor',
    'EC': 'Zap',
    'ME': 'Cog',
    'CE': 'Building',
    'EE': 'Lightbulb',
    'CH': 'Beaker',
    'BT': 'Leaf',
    'AU': 'Car',
    'AE': 'Plane',
    'IT': 'Smartphone'
  }
  
  return icons[code] || 'BookOpen'
}
