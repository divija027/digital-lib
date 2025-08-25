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

// Convert slug back to subject name
const slugToSubject = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ branch: string; subject: string }> 
}): Promise<Metadata> {
  const { branch: branchSlug, subject: subjectSlug } = await params
  
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  const subjectName = slugToSubject(subjectSlug)
  
  if (!branchData) {
    return {
      title: 'Subject Not Found - VTU Digital Library',
      description: 'The requested subject could not be found.'
    }
  }

  const title = `${subjectName} - ${branchData.name} | VTU Digital Library`
  const description = `Access comprehensive study materials, notes, question papers, and resources for ${subjectName} in ${branchData.name} at VTU Digital Library.`

  return {
    title,
    description,
    keywords: [
      subjectName,
      branchData.name,
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
      url: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects/${subjectSlug}`,
      siteName: 'VTU Digital Library',
      images: [
        {
          url: 'https://vtu-digital-library.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${subjectName} - ${branchData.name} Study Materials`,
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
      canonical: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects/${subjectSlug}`,
    },
  }
}

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
