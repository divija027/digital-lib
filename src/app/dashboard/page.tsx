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

// Branch to slug mapping for routing
const BRANCH_TO_SLUG: Record<string, string> = {
  'PHYSICS': 'physics',
  'CHEMISTRY': 'chemistry',
  'CSE': 'cs',
  'ISE': 'is', 
  'ECE': 'ece',
  'AIML': 'ai',
  'EEE': 'eee',
  'CE': 'civil',
  'ME': 'mech'
}

export default function DashboardPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)

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
    const slug = BRANCH_TO_SLUG[branchCode]
    if (slug) {
      router.push(`/dashboard/${slug}`)
    }
  }

  const handleCycleClick = (cycleType: 'physics' | 'chemistry') => {
    router.push(`/dashboard/${cycleType}/subjects`)
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

          {/* Enhanced 3x3 Branch Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Physics Cycle */}
              <BranchCard
                title="Physics"
                subtitle="Foundation Year"
                icon="⚛️"
                color="from-indigo-500 to-purple-600"
                hoverColor="hover:border-indigo-300"
                badges={[{ text: "First Year", variant: "secondary" }, { text: "Core", variant: "outline" }]}
                onClick={() => handleCycleClick('physics')}
              />

              {/* Chemistry Cycle */}
              <BranchCard
                title="Chemistry"
                subtitle="Foundation Year"
                icon="🧪"
                color="from-green-500 to-emerald-600"
                hoverColor="hover:border-green-300"
                badges={[{ text: "First Year", variant: "secondary" }, { text: "Core", variant: "outline" }]}
                onClick={() => handleCycleClick('chemistry')}
              />

              {/* Computer Science */}
              <BranchCard
                title="Computer Science"
                subtitle="CSE"
                icon="💻"
                color="from-blue-500 to-cyan-600"
                hoverColor="hover:border-blue-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('CSE')}
              />

              {/* Information Science */}
              <BranchCard
                title="Information Science"
                subtitle="ISE"
                icon="🌐"
                color="from-cyan-500 to-teal-600"
                hoverColor="hover:border-cyan-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('ISE')}
              />

              {/* Electronics & Communication */}
              <BranchCard
                title="Electronics & Communication"
                subtitle="ECE"
                icon="📡"
                color="from-purple-500 to-violet-600"
                hoverColor="hover:border-purple-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('ECE')}
              />

              {/* Artificial Intelligence */}
              <BranchCard
                title="Artificial Intelligence"
                subtitle="AI & ML"
                icon="🤖"
                color="from-rose-500 to-pink-600"
                hoverColor="hover:border-rose-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('AIML')}
              />

              {/* Electrical & Electronics */}
              <BranchCard
                title="Electrical & Electronics"
                subtitle="EEE"
                icon="⚡"
                color="from-yellow-500 to-amber-600"
                hoverColor="hover:border-yellow-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('EEE')}
              />

              {/* Civil Engineering */}
              <BranchCard
                title="Civil Engineering"
                subtitle="Civil"
                icon="🏗️"
                color="from-emerald-500 to-green-600"
                hoverColor="hover:border-emerald-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('CE')}
              />

              {/* Mechanical Engineering */}
              <BranchCard
                title="Mechanical Engineering"
                subtitle="Mech"
                icon="⚙️"
                color="from-orange-500 to-red-600"
                hoverColor="hover:border-orange-300"
                badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
                onClick={() => handleBranchClick('ME')}
              />
            </div>
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


