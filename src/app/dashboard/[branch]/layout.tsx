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
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const branchCode = BRANCH_SLUG_MAP[branch?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
  if (!branchData) {
    return {
      title: 'Branch Not Found - BrainReef',
      description: 'The requested branch could not be found.'
    }
  }

  return {
    title: `${branchData.name} - VTU Study Materials | BrainReef`,
    description: `Access ${branchData.name} study materials, syllabus, and resources. ${branchData.description}`,
    keywords: `VTU, ${branchData.name}, ${branchData.code}, study materials, engineering`,
    openGraph: {
      title: `${branchData.name} - VTU Study Materials`,
      description: `Access ${branchData.name} study materials, syllabus, and resources.`,
      type: 'website',
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
