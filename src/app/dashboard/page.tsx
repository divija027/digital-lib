'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  GraduationCap,
  ChevronRight
} from 'lucide-react'
import { getBranchSlug } from '@/lib/branch-utils'

export default function DashboardPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [branches, setBranches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      // Add cache busting to ensure fresh data
      const timestamp = Date.now()
      const response = await fetch(`/api/admin/branches?t=${timestamp}`)
      const data = await response.json()
      
      if (data.success) {
        // Sort by order and filter active branches
        const sortedActiveBranches = data.branches
          .filter((branch: any) => branch.isActive)
          .sort((a: any, b: any) => a.order - b.order)
        setBranches(sortedActiveBranches)
      } else {
        console.error('Failed to fetch branches:', data.error)
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let ticking = false
    
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        // Set scrolled state for shadow effect
        setScrolled(currentScrollY > 10)
        
        if (currentScrollY < 80) {
          // Always show navbar at the top of the page
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Hide navbar when scrolling down and past threshold
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY) {
          // Show navbar when scrolling up
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
      
      // Cleanup function
      return () => {
        window.removeEventListener('scroll', requestTick)
      }
    }
  }, [lastScrollY])

  const handleBranchClick = (branchCode: string) => {
    const slug = getBranchSlug(branchCode)
    router.push(`/dashboard/${slug}`)
  }

  const handleCycleClick = (branchCode: string) => {
    const slug = getBranchSlug(branchCode)
    router.push(`/dashboard/${slug}/subjects`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className={`bg-white/95 backdrop-blur-xl border-b border-gray-200/60 transition-all duration-300 ${
          scrolled ? 'shadow-lg bg-white/98' : 'shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-3 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
                isVisible ? 'scale-100' : 'scale-95'
              }`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  BrainReef
                </h1>
                <p className="text-sm text-gray-600 font-medium">VTU Learning Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-100 transition-all duration-300 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-80 scale-95'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Dashboard</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 ${
                  isVisible ? 'scale-100' : 'scale-95'
                }`}
                onClick={() => window.location.href = '/'}
              >
                <span className="hidden sm:inline text-sm font-medium">Home</span>
                <BookOpen className="w-4 h-4 sm:hidden" />
              </Button>
            </div>
          </div>
        </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Overview */}
        <div className="space-y-12">
          {/* Quiz Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3">Daily Programming Quiz</h2>
                <p className="text-blue-100 text-lg mb-4">
                  Test your programming knowledge with our daily challenges. 
                  Unlock new levels and compete with other students!
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    🏆 Competitive
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    ⏱️ 90s per question
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    🎯 20 questions daily
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => router.push('/quiz')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Start Quiz Challenge
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-bold">Day 1</div>
                  <div className="text-blue-200 text-sm">Available Now</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">Academic Programs</h1>
                <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                  Choose your academic program to access comprehensive question papers and study resources
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Branch Grid */}
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Render Cycles First */}
                {branches
                  .filter(branch => branch.type === 'cycle')
                  .map((cycle) => (
                    <BranchCard
                      key={cycle.id}
                      title={cycle.name.replace(' Cycle', '')}
                      subtitle="Foundation Year"
                      icon={cycle.icon}
                      color={`from-${cycle.color.replace('bg-', '').replace('-500', '-500')} to-${cycle.color.replace('bg-', '').replace('-500', '-600')}`}
                      hoverColor={`hover:border-${cycle.color.replace('bg-', '').replace('-500', '-300')}`}
                      badges={[{ text: "First Year", variant: "secondary" }, { text: "Core", variant: "outline" }]}
                      onClick={() => handleCycleClick(cycle.code)}
                    />
                  ))
                }
                
                {/* Render Engineering Branches */}
                {branches
                  .filter(branch => branch.type === 'branch')
                  .map((branch) => (
                    <BranchCard
                      key={branch.id}
                      title={branch.name}
                      subtitle={branch.code}
                      icon={branch.icon}
                      color={`from-${branch.color.replace('bg-', '').replace('-500', '-500')} to-${branch.color.replace('bg-', '').replace('-500', '-600')}`}
                      hoverColor={`hover:border-${branch.color.replace('bg-', '').replace('-500', '-300')}`}
                      badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                      onClick={() => handleBranchClick(branch.code)}
                    />
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">BrainReef</span>
              </div>
              <p className="text-sm text-gray-600">
                Your comprehensive VTU study materials platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Question Papers</li>
                <li>Study Notes</li>
                <li>Syllabus</li>
                <li>Previous Year Papers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Branches</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Computer Science</li>
                <li>Information Science</li>
                <li>Electronics & Communication</li>
                <li>Mechanical Engineering</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Report Issue</li>
                <li>Request Content</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-center text-sm text-gray-600">
              © 2024 BrainReef. All rights reserved. Made for VTU students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Branch Card Component
const BranchCard = ({ title, subtitle, icon, color, hoverColor, badges, onClick }: {
  title: string
  subtitle: string
  icon: string
  color: string
  hoverColor: string
  badges: Array<{ text: string, variant: any }>
  onClick: () => void
}) => (
  <div 
    className={`group cursor-pointer bg-white rounded-3xl p-8 border-2 border-gray-100 ${hoverColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center text-center space-y-6">
      <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {badges.map((badge, index) => (
          <Badge key={index} variant={badge.variant} className="text-xs">{badge.text}</Badge>
        ))}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  </div>
)


