import { Metadata } from 'next'
import { getBranchCodeFromSlug } from '@/lib/branch-utils'

interface Subject {
  id: string
  name: string
  code: string
  credits: number
  type: string
  semester: number | null
  description?: string
}

interface Branch {
  id: string
  name: string
  code: string
  isActive: boolean
}

// Convert subject slug back to name
const slugToSubjectName = (slug: string, subjects: Subject[]): string => {
  const subjectFromSlug = subjects.find(s => 
    s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === slug
  )
  return subjectFromSlug?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

type Props = {
  params: Promise<{ branch: string, semester: string, subject: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, semester, subject } = await params
  
  try {
    const branchCode = await getBranchCodeFromSlug(branch)
    
    if (!branchCode) {
      return {
        title: 'Subject Not Found - BrainReef',
        description: 'The requested subject could not be found.'
      }
    }

    // Fetch branch data
    const branchResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/branches`)
    const branchesData = await branchResponse.json()
    const branchData = branchesData.find((b: Branch) => b.code === branchCode)

    if (!branchData) {
      return {
        title: 'Branch Not Found - BrainReef',
        description: 'The requested branch could not be found.'
      }
    }

    // Fetch subjects for this branch
    const subjectsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/branches/${branchData.id}/subjects`)
    const subjects: Subject[] = await subjectsResponse.json()

    let semesterNumber: number | string
    let filteredSubjects: Subject[]

    if (semester === 'physics-cycle') {
      semesterNumber = 'Physics Cycle'
      filteredSubjects = subjects.filter(s => s.semester === null)
    } else if (semester === 'chemistry-cycle') {
      semesterNumber = 'Chemistry Cycle'
      filteredSubjects = subjects.filter(s => s.semester === null)
    } else {
      semesterNumber = parseInt(semester)
      filteredSubjects = subjects.filter(s => s.semester === semesterNumber)
    }

    const subjectName = slugToSubjectName(subject, filteredSubjects)
    const currentSubject = filteredSubjects.find(s => 
      s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === subject
    )

    let semesterDisplay: string
    if (typeof semesterNumber === 'number') {
      semesterDisplay = `Semester ${semesterNumber}`
    } else {
      semesterDisplay = semesterNumber
    }

    return {
      title: `${subjectName} - ${semesterDisplay} ${branchData.name} | BrainReef`,
      description: `Study ${subjectName} with comprehensive question papers and resources. ${currentSubject?.description || `${currentSubject?.credits || ''} credits ${currentSubject?.type || ''} subject for VTU students.`}`,
      keywords: `VTU, ${branchData.name}, ${semesterDisplay}, ${subjectName}, question papers, previous year papers, ${currentSubject?.code || ''}`,
      openGraph: {
        title: `${subjectName} - ${semesterDisplay} ${branchData.name}`,
        description: `Study ${subjectName} with comprehensive question papers and resources for VTU students.`,
        type: 'website',
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Subject - BrainReef',
      description: 'Study resources for VTU students.'
    }
  }
}

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
