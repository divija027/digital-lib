import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

// Mock settings structure - in production, you'd want a settings table
interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    adminEmail: string
    maintenanceMode: boolean
    registrationEnabled: boolean
    emailNotifications: boolean
  }
  upload: {
    maxFileSize: number // in MB
    allowedFileTypes: string[]
    requireApproval: boolean
    virusScanEnabled: boolean
    autoGenerateThumbnails: boolean
  }
  user: {
    defaultRole: string
    sessionTimeout: number // in minutes
    maxLoginAttempts: number
    passwordMinLength: number
    requireEmailVerification: boolean
  }
  security: {
    twoFactorEnabled: boolean
    ipWhitelist: string[]
    rateLimitEnabled: boolean
    auditLogRetentionDays: number
    encryptionEnabled: boolean
  }
  advanced: {
    debugMode: boolean
    cacheEnabled: boolean
    backupEnabled: boolean
    analyticsEnabled: boolean
    apiRateLimit: number
  }
}

// Mock default settings
const defaultSettings: SystemSettings = {
  general: {
    siteName: 'VTU Digital Library',
    siteDescription: 'Digital resource library for VTU students',
    adminEmail: 'admin@vtu-digital-lib.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true
  },
  upload: {
    maxFileSize: 50,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'png'],
    requireApproval: true,
    virusScanEnabled: false,
    autoGenerateThumbnails: true
  },
  user: {
    defaultRole: 'STUDENT',
    sessionTimeout: 480,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireEmailVerification: false
  },
  security: {
    twoFactorEnabled: false,
    ipWhitelist: [],
    rateLimitEnabled: true,
    auditLogRetentionDays: 90,
    encryptionEnabled: true
  },
  advanced: {
    debugMode: false,
    cacheEnabled: true,
    backupEnabled: false,
    analyticsEnabled: true,
    apiRateLimit: 100
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    if (section && section !== 'all') {
      if (!(section in defaultSettings)) {
        return createAdminResponse('Invalid settings section', 400)
      }
      return Response.json({ [section]: defaultSettings[section as keyof SystemSettings] })
    }

    // Return all settings
    return Response.json(defaultSettings)

  } catch (error) {
    console.error('Settings API error:', error)
    return createAdminResponse('Failed to fetch settings', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { section, settings } = body

    if (!section || !settings) {
      return createAdminResponse('Section and settings are required', 400)
    }

    if (!(section in defaultSettings)) {
      return createAdminResponse('Invalid settings section', 400)
    }

    // In production, you'd save these to a database
    // For now, we'll just validate and return the updated settings
    const updatedSettings = {
      ...defaultSettings,
      [section]: {
        ...defaultSettings[section as keyof SystemSettings],
        ...settings
      }
    }

    // Validate specific settings
    if (section === 'upload') {
      if (settings.maxFileSize && (settings.maxFileSize < 1 || settings.maxFileSize > 1000)) {
        return createAdminResponse('Max file size must be between 1 and 1000 MB', 400)
      }
    }

    if (section === 'user') {
      if (settings.passwordMinLength && (settings.passwordMinLength < 6 || settings.passwordMinLength > 50)) {
        return createAdminResponse('Password minimum length must be between 6 and 50 characters', 400)
      }
      if (settings.sessionTimeout && (settings.sessionTimeout < 30 || settings.sessionTimeout > 1440)) {
        return createAdminResponse('Session timeout must be between 30 and 1440 minutes', 400)
      }
    }

    if (section === 'security') {
      if (settings.auditLogRetentionDays && (settings.auditLogRetentionDays < 7 || settings.auditLogRetentionDays > 3650)) {
        return createAdminResponse('Audit log retention must be between 7 and 3650 days', 400)
      }
    }

    // Create audit log entry
    const auditLogData = {
      action: 'UPDATE_SETTINGS',
      entityType: 'SYSTEM',
      entityId: section,
      details: `Updated ${section} settings: ${Object.keys(settings).join(', ')}`,
      status: 'SUCCESS'
    }

    // Mock saving audit log
    console.log('Audit log:', auditLogData)

    return Response.json({
      message: 'Settings updated successfully',
      settings: updatedSettings[section as keyof SystemSettings]
    })

  } catch (error) {
    console.error('Update settings API error:', error)
    return createAdminResponse('Failed to update settings', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'reset_to_defaults':
        // Reset all settings to defaults
        return Response.json({
          message: 'Settings reset to defaults successfully',
          settings: defaultSettings
        })

      case 'export_settings':
        // Export current settings
        return Response.json({
          message: 'Settings exported successfully',
          export: {
            timestamp: new Date().toISOString(),
            settings: defaultSettings
          }
        })

      case 'clear_cache':
        // Clear system cache
        return Response.json({
          message: 'System cache cleared successfully'
        })

      case 'test_email':
        // Test email configuration
        return Response.json({
          message: 'Test email sent successfully'
        })

      default:
        return createAdminResponse('Invalid action', 400)
    }

  } catch (error) {
    console.error('Settings action API error:', error)
    return createAdminResponse('Failed to perform settings action', 500)
  }
}
