'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Brain,
  PenTool,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoutConfirmation } from '@/components/LogoutConfirmation'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: 'Branch Management',
    href: '/admin/branches',
    icon: BookOpen,
    children: [
      { title: 'All Branches', href: '/admin/branches' },
      { title: 'Add New Branch', href: '/admin/branches/new' },
      { title: 'Reorder Branches', href: '/admin/branches/reorder' }
    ]
  },
  {
    title: 'PDF Management',
    href: '/admin/pdfs',
    icon: FileText,
    children: [
      { title: 'Upload PDF', href: '/admin/pdfs' },
      { title: 'All PDFs', href: '/admin/pdfs' }
    ]
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    children: [
      { title: 'All Users', href: '/admin/users' },
      { title: 'Admins', href: '/admin/users?role=admin' },
      { title: 'Students', href: '/admin/users?role=student' }
    ]
  },

  {
    title: 'Blog Management',
    href: '/admin/blog',
    icon: PenTool,
    children: [
      { title: 'All Posts', href: '/admin/blog' },
      { title: 'Categories', href: '/admin/blog?tab=categories' },
      { title: 'Tags', href: '/admin/blog?tab=tags' },
      { title: 'Analytics', href: '/admin/blog?tab=analytics' }
    ]
  },
  {
    title: 'MCQ Management',
    href: '/admin/mcq',
    icon: Brain,
    children: [
      { title: 'Overview', href: '/admin/mcq' },
      { title: 'Question Sets', href: '/admin/mcq?tab=sets' },
      { title: 'Bulk Upload', href: '/admin/mcq?tab=upload' }
    ]
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // Use admin authentication hook
  const { user, isLoading, isAuthenticated } = useAdminAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the hook will redirect to 404
  if (!isAuthenticated || !user) {
    return null
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Optional: Call logout API
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear any admin-specific localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
      // Redirect to main site
      router.push('/')
    } catch (error) {
      console.error('Admin logout error:', error)
      // Fallback: redirect anyway
      router.push('/')
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(true)}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">VTU Admin</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.title}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={`flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href, item.exact)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </Link>
                {item.children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.title)}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      expandedItems.includes(item.title) ? 'rotate-180' : ''
                    }`} />
                  </Button>
                )}
              </div>
              
              {/* Submenu */}
              {item.children && expandedItems.includes(item.title) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive(child.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        userName={user?.name || 'Admin'}
        isLoading={isLoggingOut}
        variant="admin"
      />
    </div>
  )
}
