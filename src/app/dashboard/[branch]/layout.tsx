
import { Metadata } from 'next'
import { getBranchCodeFromSlug } from '@/lib/branch-utils'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const branchCode = await getBranchCodeFromSlug(branch)
  
  if (!branchCode) {
    return {
      title: 'Branch Not Found - BrainReef',
      description: 'The requested branch could not be found.'
    }
  }

  // Fetch branch data from API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/branches`)
    const data = await response.json()
    const branches = data.success ? data.branches : []
    const branchData = branches.find((b: any) => b.code === branchCode)
    
    if (!branchData) {
      return {
        title: 'Branch Not Found - BrainReef',
        description: 'The requested branch could not be found.'
      }
    }

    return {
      title: `${branchData.name} - VTU Study Materials | BrainReef`,
      description: `Access ${branchData.name} study materials, syllabus, and resources. ${branchData.description || ''}`,
      keywords: `VTU, ${branchData.name}, ${branchData.code}, study materials, engineering`,
      openGraph: {
        title: `${branchData.name} - VTU Study Materials`,
        description: `Access ${branchData.name} study materials, syllabus, and resources.`,
        type: 'website',
      }
    }
  } catch (error) {
    console.error('Error fetching branch data:', error)
    return {
      title: 'Branch - BrainReef',
      description: 'VTU study materials and resources.'
    }
  }
}

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
