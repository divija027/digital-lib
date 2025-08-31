import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

// First, let's add an audit log model to track admin actions
// For now, we'll create mock data, but in production you'd want to add this to your schema

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  userName: string
  userEmail: string
  details: string
  ipAddress?: string
  userAgent?: string
  status: 'SUCCESS' | 'FAILED' | 'WARNING'
  createdAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const action = searchParams.get('action') || ''
    const entityType = searchParams.get('entityType') || ''
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Mock audit logs for now - in production, you'd query from an audit_logs table
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        action: 'CREATE',
        entityType: 'USER',
        entityId: 'user_123',
        userId: admin.id,
        userName: admin.name || 'Admin',
        userEmail: admin.email,
        details: 'Created new student account for john.doe@student.com',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '2',
        action: 'APPROVE',
        entityType: 'RESOURCE',
        entityId: 'res_456',
        userId: admin.id,
        userName: admin.name || 'Admin',
        userEmail: admin.email,
        details: 'Approved resource "Data Structures Notes"',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: '3',
        action: 'DELETE',
        entityType: 'RESOURCE',
        entityId: 'res_789',
        userId: admin.id,
        userName: admin.name || 'Admin',
        userEmail: admin.email,
        details: 'Deleted inappropriate resource content',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 90)
      },
      {
        id: '4',
        action: 'UPDATE',
        entityType: 'USER',
        entityId: 'user_321',
        userId: admin.id,
        userName: admin.name || 'Admin',
        userEmail: admin.email,
        details: 'Changed user role from STUDENT to ADMIN',
        status: 'WARNING',
        createdAt: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        id: '5',
        action: 'LOGIN_ATTEMPT',
        entityType: 'AUTH',
        entityId: 'auth_fail',
        userId: 'unknown',
        userName: 'Unknown User',
        userEmail: 'hacker@malicious.com',
        details: 'Failed admin login attempt with invalid credentials',
        status: 'FAILED',
        createdAt: new Date(Date.now() - 1000 * 60 * 150)
      }
    ]

    // Apply filters to mock data
    let filteredLogs = mockLogs

    if (search) {
      const searchLower = search.toLowerCase()
      filteredLogs = filteredLogs.filter(log =>
        log.action.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.userEmail.toLowerCase().includes(searchLower)
      )
    }

    if (action && action !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }

    if (entityType && entityType !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.entityType === entityType)
    }

    if (status && status !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === status)
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      filteredLogs = filteredLogs.filter(log => log.createdAt >= fromDate)
    }

    if (dateTo) {
      const toDate = new Date(dateTo)
      filteredLogs = filteredLogs.filter(log => log.createdAt <= toDate)
    }

    // Pagination
    const totalLogs = filteredLogs.length
    const skip = (page - 1) * limit
    const paginatedLogs = filteredLogs.slice(skip, skip + limit)
    const totalPages = Math.ceil(totalLogs / limit)

    // Statistics
    const stats = {
      totalLogs,
      successCount: filteredLogs.filter(log => log.status === 'SUCCESS').length,
      failedCount: filteredLogs.filter(log => log.status === 'FAILED').length,
      warningCount: filteredLogs.filter(log => log.status === 'WARNING').length
    }

    return Response.json({
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalLogs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats
    })

  } catch (error) {
    console.error('Audit logs API error:', error)
    return createAdminResponse('Failed to fetch audit logs', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { action, entityType, entityId, details, status = 'SUCCESS' } = body

    // In production, you'd save this to an audit_logs table
    const auditLog: AuditLog = {
      id: `log_${Date.now()}`,
      action,
      entityType,
      entityId,
      userId: admin.id,
      userName: admin.name || 'Admin',
      userEmail: admin.email,
      details,
      status,
      createdAt: new Date()
    }

    // Mock response - in production, save to database
    return Response.json(auditLog, { status: 201 })

  } catch (error) {
    console.error('Create audit log API error:', error)
    return createAdminResponse('Failed to create audit log', 500)
  }
}
