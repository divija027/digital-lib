'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  Home, 
  Settings,
  ChevronDown,
  Menu,
  X,
  Bell,
  HelpCircle,
  Brain,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LogoutConfirmation } from '@/components/LogoutConfirmation'

export default function DashboardNavbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Scroll handling for navbar visibility
  useEffect(() => {
    let ticking = false
    
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        setScrolled(currentScrollY > 10)
        
        if (currentScrollY < 80) {
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(controlNavbar)
        ticking = true
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', requestTick, { passive: true })
      return () => window.removeEventListener('scroll', requestTick)
    }
  }, [lastScrollY])

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      logout()
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // Get breadcrumb from pathname
  const getBreadcrumb = () => {
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length === 1 && pathParts[0] === 'dashboard') {
      return 'Dashboard'
    }
    if (pathParts.length >= 2) {
      const branch = pathParts[1]
      const formattedBranch = branch.charAt(0).toUpperCase() + branch.slice(1).replace('-', ' ')
      if (pathParts.includes('subjects')) {
        return `${formattedBranch} / Subjects`
      }
      return formattedBranch
    }
    return 'Dashboard'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className={`bg-white/95 backdrop-blur-xl border-b border-gray-200/60 transition-all duration-300 ${
          scrolled ? 'shadow-lg bg-white/98' : 'shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Left Section - Logo & Breadcrumb */}
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      BrainReef
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">VTU Learning Hub</p>
                  </div>
                </Link>

                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {getBreadcrumb()}
                  </Badge>
                </div>
              </div>

              {/* Center Section - Search (Hidden on mobile) */}
              <div className="hidden lg:block flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                  />
                </form>
              </div>

              {/* Right Section - User Menu & Actions */}
              <div className="flex items-center gap-3">
                
                {/* Quick Actions */}
                <div className="hidden md:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => router.push('/quiz')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    <span className="hidden lg:inline">Quiz</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>

                {/* User Menu */}
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.collegeName && (
                            <p className="text-xs text-gray-400">{user.collegeName}</p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => router.push('/')}>
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Help & Support
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => setShowLogoutConfirm(true)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Guest user actions
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                      Login
                    </Button>
                    <Button size="sm" onClick={() => router.push('/register')}>
                      Sign Up
                    </Button>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </form>

                {/* Mobile Breadcrumb */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {getBreadcrumb()}
                  </Badge>
                </div>

                {/* Mobile Actions */}
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/quiz')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Practice Quiz
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        userName={user?.name}
        isLoading={isLoggingOut}
        variant="main"
      />
    </>
  )
}