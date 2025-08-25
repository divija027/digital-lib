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

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ branch: string }> 
}): Promise<Metadata> {
  const { branch: branchSlug } = await params
  
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
  if (!branchData) {
    return {
      title: 'Subjects Not Found - VTU Digital Library',
      description: 'The requested subjects could not be found.'
    }
  }

  const title = `${branchData.name} Subjects | VTU Digital Library`
  const description = `Browse all subjects and study materials for ${branchData.name} at VTU Digital Library. Access comprehensive notes, question papers, and resources.`

  return {
    title,
    description,
    keywords: [
      branchData.name,
      'subjects',
      'VTU',
      'study materials',
      'question papers',
      'notes',
      'engineering',
      'education',
      'Karnataka',
      'university'
    ],
    authors: [{ name: 'VTU Digital Library' }],
    creator: 'VTU Digital Library',
    publisher: 'VTU Digital Library',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects`,
      siteName: 'VTU Digital Library',
      images: [
        {
          url: 'https://vtu-digital-library.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${branchData.name} Subjects - VTU Digital Library`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://vtu-digital-library.com/twitter-image.jpg'],
      creator: '@vtudigitallib',
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects`,
    },
  }
}

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
