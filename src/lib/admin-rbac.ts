/**
 * Admin Role-Based Access Control Configuration
 * Simple and maintainable RBAC for admin access
 */

// Whitelist of users allowed to access admin functionality
export const ADMIN_WHITELIST = {
  emails: ['admin@gmail.com', 'superadmin@gmail.com'],
  roles: ['ADMIN', 'SUPERADMIN']
} as const

/**
 * Simple validation function to check if a user can access admin routes
 * @param email - User's email address
 * @param role - User's role
 * @returns boolean - true if user is allowed, false otherwise
 */
export function isAdminAllowed(email: string, role: string): boolean {
  const emailAllowed = ADMIN_WHITELIST.emails.includes(email as any)
  const roleAllowed = ADMIN_WHITELIST.roles.includes(role as any)
  
  return emailAllowed && roleAllowed
}