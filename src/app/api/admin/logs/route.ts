import { NextRequest } from 'next/server'

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
        userId: 'admin_123',
        userName: 'System Admin',
        userEmail: 'admin@vtu.in',
        details: 'Created new student account for john.doe@student.com',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '2',
        action: 'APPROVE',
        entityType: 'RESOURCE',
        entityId: 'res_456',
        userId: 'admin_123',
        userName: 'System Admin',
        userEmail: 'admin@vtu.in',
        details: 'Approved resource "Data Structures Notes"',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: '3',
        action: 'DELETE',
        entityType: 'RESOURCE',
        entityId: 'res_789',
        userId: 'admin_123',
        userName: 'System Admin',
        userEmail: 'admin@vtu.in',
        details: 'Deleted inappropriate resource content',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 90)
      },
      {
        id: '4',
        action: 'UPDATE',
        entityType: 'USER',
        entityId: 'user_321',
        userId: 'admin_123',
        userName: 'System Admin',
        userEmail: 'admin@vtu.in',
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

    // Apply filters
    let filteredLogs = mockLogs

    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }

    if (entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === entityType)
    }

    if (status) {
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
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    // Stats
    const stats = {
      totalLogs: filteredLogs.length,
      successLogs: filteredLogs.filter(log => log.status === 'SUCCESS').length,
      failedLogs: filteredLogs.filter(log => log.status === 'FAILED').length,
      warningLogs: filteredLogs.filter(log => log.status === 'WARNING').length,
      actionBreakdown: filteredLogs.reduce((acc: any, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      }, {}),
      entityBreakdown: filteredLogs.reduce((acc: any, log) => {
        acc[log.entityType] = (acc[log.entityType] || 0) + 1
        return acc
      }, {})
    }

    const totalPages = Math.ceil(filteredLogs.length / limit)

    return Response.json({
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalLogs: filteredLogs.length,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      },
      stats
    })

  } catch (error) {
    console.error('Audit logs API error:', error)
    return Response.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, entityType, entityId, details, status = 'SUCCESS' } = body

    // In production, you'd save this to an audit_logs table
    const auditLog: AuditLog = {
      id: `log_${Date.now()}`,
      action,
      entityType,
      entityId,
      userId: 'admin_123',
      userName: 'System Admin',
      userEmail: 'admin@vtu.in',
      details,
      status,
      createdAt: new Date()
    }

    // Mock response - in production, save to database
    return Response.json(auditLog, { status: 201 })

  } catch (error) {
    console.error('Create audit log API error:', error)
    return Response.json({ error: 'Failed to create audit log' }, { status: 500 })
  }
}
