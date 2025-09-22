import { Metadata } from 'next'
import { getBranchCodeFromSlug } from '@/lib/branch-utils'

type Props = {
  params: Promise<{ branch: string, semester: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, semester } = await params
  const branchCode = await getBranchCodeFromSlug(branch)
  
  if (!branchCode) {
    return {
      title: 'Subjects Not Found - BrainReef',
      description: 'The requested subjects could not be found.'
    }
  }

  // Fetch branch data from API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/branches`)
    const branches = await response.json()
    const branchData = branches.find((b: { code: string }) => b.code === branchCode)
    
    if (!branchData) {
      return {
        title: 'Subjects Not Found - BrainReef',
        description: 'The requested subjects could not be found.'
      }
    }

    let semesterDisplay: string
    if (semester === 'physics-cycle') {
      semesterDisplay = 'Physics Cycle'
    } else if (semester === 'chemistry-cycle') {
      semesterDisplay = 'Chemistry Cycle'
    } else {
      semesterDisplay = `Semester ${semester}`
    }

    return {
      title: `${semesterDisplay} ${branchData.name} Subjects - VTU | BrainReef`,
      description: `Browse ${semesterDisplay} subjects for ${branchData.name}. Access question papers and study resources for VTU students.`,
      keywords: `VTU, ${branchData.name}, ${semesterDisplay}, subjects, study materials`,
      openGraph: {
        title: `${semesterDisplay} ${branchData.name} Subjects - VTU`,
        description: `Browse ${semesterDisplay} subjects for ${branchData.name}. Access comprehensive study materials and resources.`,
        type: 'website',
      }
    }
  } catch (error) {
    console.error('Error fetching branch data:', error)
    return {
      title: 'Subjects - BrainReef',
      description: 'VTU study materials and resources.'
    }
  }
}

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
