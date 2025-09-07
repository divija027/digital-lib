import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
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
      
      acc[branchCode].subjects.push({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        resourceCount: subject._count.resources
      })
      
      acc[branchCode].resourceCount += subject._count.resources
      
      return acc
    }, {} as any)

    // Convert to array
    const branchesArray = Object.values(branches)

    return Response.json({
      branches: branchesArray,
      totalBranches: branchesArray.length,
      totalSubjects: subjects.length,
      totalResources: subjects.reduce((sum, subject) => sum + subject._count.resources, 0)
    })

  } catch (error) {
    console.error('Branches API error:', error)
    return Response.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, description, color, icon } = body

    // Validate required fields
    if (!name || !code) {
      return Response.json({ error: 'Name and code are required' }, { status: 400 })
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
    return Response.json({ error: 'Failed to create branch' }, { status: 500 })
  }
}

function getBranchName(code: string): string {
  const branchMap: { [key: string]: string } = {
    'CS': 'Computer Science',
    'IT': 'Information Technology',
    'EC': 'Electronics & Communication',
    'EE': 'Electrical',
    'ME': 'Mechanical',
    'CE': 'Civil',
    'CH': 'Chemical',
    'BT': 'Biotechnology',
    'AE': 'Aeronautical',
    'AU': 'Automobile',
    'EN': 'Environmental',
    'IN': 'Industrial',
    'MT': 'Metallurgy',
    'MN': 'Mining',
    'TX': 'Textile',
    'PH': 'Physics',
    'CY': 'Chemistry',
    'MA': 'Mathematics'
  }
  
  return branchMap[code.toUpperCase()] || 'Unknown Branch'
}

function getBranchColor(code: string): string {
  const colorMap: { [key: string]: string } = {
    'CS': '#3b82f6', // Blue
    'IT': '#8b5cf6', // Purple
    'EC': '#f59e0b', // Amber
    'EE': '#ef4444', // Red
    'ME': '#059669', // Emerald
    'CE': '#6b7280', // Gray
    'CH': '#dc2626', // Red
    'BT': '#16a34a', // Green
    'AE': '#0ea5e9', // Sky
    'AU': '#f97316', // Orange
    'EN': '#22c55e', // Green
    'IN': '#a855f7', // Violet
    'MT': '#64748b', // Slate
    'MN': '#78716c', // Stone
    'TX': '#ec4899', // Pink
    'PH': '#06b6d4', // Cyan
    'CY': '#84cc16', // Lime
    'MA': '#6366f1'  // Indigo
  }
  
  return colorMap[code.toUpperCase()] || '#6b7280'
}

function getBranchIcon(code: string): string {
  const iconMap: { [key: string]: string } = {
    'CS': 'Code',
    'IT': 'Monitor',
    'EC': 'Cpu',
    'EE': 'Zap',
    'ME': 'Settings',
    'CE': 'Building',
    'CH': 'TestTube',
    'BT': 'Microscope',
    'AE': 'Plane',
    'AU': 'Car',
    'EN': 'Leaf',
    'IN': 'Factory',
    'MT': 'Hammer',
    'MN': 'Mountain',
    'TX': 'Shirt',
    'PH': 'Atom',
    'CY': 'Flask',
    'MA': 'Calculator'
  }
  
  return iconMap[code.toUpperCase()] || 'BookOpen'
}
