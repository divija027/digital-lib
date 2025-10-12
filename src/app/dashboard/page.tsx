'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Footer4 } from '@/components/Footer4'
import { 
  BookOpen, 
  GraduationCap,
  ChevronRight
} from 'lucide-react'
import { getBranchSlug } from '@/lib/branch-utils'

export default function DashboardPage() {
  const router = useRouter()
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
          .filter((branch: { isActive: boolean }) => branch.isActive)
          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
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

  const handleBranchClick = (branchCode: string) => {
    const slug = getBranchSlug(branchCode)
    router.push(`/dashboard/${slug}`)
  }

  const handleCycleClick = (branchCode: string) => {
    const slug = getBranchSlug(branchCode)
    router.push(`/dashboard/${slug}/subjects`)
  }

  return (
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

      {/* Footer */}
      <Footer4 />
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
  badges: Array<{ text: string, variant: "default" | "secondary" | "destructive" | "outline" }>
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


