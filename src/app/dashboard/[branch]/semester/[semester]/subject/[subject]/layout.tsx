import { Metadata } from 'next'
import { getBranchByCode, getCycleByCode, getSubjectsBySemester } from '@/lib/vtu-curriculum'

// Branch slug to code mapping
const BRANCH_SLUG_MAP: Record<string, string> = {
  'physics': 'PHYSICS',
  'chemistry': 'CHEMISTRY',
  'cs': 'CSE',
  'cse': 'CSE',
  'is': 'ISE',
  'ise': 'ISE',
  'ece': 'ECE',
  'ai': 'AIML',
  'aiml': 'AIML',
  'eee': 'EEE',
  'civil': 'CE',
  'ce': 'CE',
  'mech': 'ME',
  'me': 'ME'
}

// Convert subject slug back to name
const slugToSubjectName = (slug: string, subjects: any[]): string => {
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
  const branchCode = BRANCH_SLUG_MAP[branch?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
  if (!branchData) {
    return {
      title: 'Subject Not Found - BrainReef',
      description: 'The requested subject could not be found.'
    }
  }

  let semesterNumber: number | string
  if (semester === 'physics-cycle') {
    semesterNumber = 'Physics Cycle'
  } else if (semester === 'chemistry-cycle') {
    semesterNumber = 'Chemistry Cycle'
  } else {
    semesterNumber = parseInt(semester)
  }

  const subjects = getSubjectsBySemester(branchCode, semesterNumber)
  const subjectName = slugToSubjectName(subject, subjects)
  const currentSubject = subjects.find(s => 
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
    description: `Study ${subjectName} with comprehensive modules, resources, and materials. ${currentSubject?.description || `${currentSubject?.credits || ''} credits ${currentSubject?.type || ''} subject for VTU students.`}`,
    keywords: `VTU, ${branchData.name}, ${semesterDisplay}, ${subjectName}, modules, study materials, ${currentSubject?.code || ''}`,
    openGraph: {
      title: `${subjectName} - ${semesterDisplay} ${branchData.name}`,
      description: `Study ${subjectName} with comprehensive modules and resources for VTU students.`,
      type: 'website',
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
