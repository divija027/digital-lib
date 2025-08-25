import { Metadata } from 'next'
import { getBranchByCode, getCycleByCode } from '@/lib/vtu-curriculum'

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

type Props = {
  params: Promise<{ branch: string, semester: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, semester } = await params
  const branchCode = BRANCH_SLUG_MAP[branch?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
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
    description: `Browse ${semesterDisplay} subjects for ${branchData.name}. Access study materials, modules, and resources for VTU students.`,
    keywords: `VTU, ${branchData.name}, ${semesterDisplay}, subjects, study materials`,
    openGraph: {
      title: `${semesterDisplay} ${branchData.name} Subjects - VTU`,
      description: `Browse ${semesterDisplay} subjects for ${branchData.name}. Access comprehensive study materials and resources.`,
      type: 'website',
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
