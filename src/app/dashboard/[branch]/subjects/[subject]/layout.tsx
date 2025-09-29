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
  
  try {
    const branchCode = await getBranchCodeFromSlug(branchSlug)
    
    if (!branchCode) {
      return {
        title: 'Subject Not Found - Brainreef',
        description: 'The requested subject could not be found.'
      }
    }

    // Fetch branch data
    const branchResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/branches`)
    const branchesData = await branchResponse.json()
    const branchData = branchesData.find((b: Branch) => b.code === branchCode)

    if (!branchData) {
      return {
        title: 'Branch Not Found - Brainreef',
        description: 'The requested branch could not be found.'
      }
    }

    // Fetch subjects for this branch to get more details
    const subjectsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/branches/${branchData.id}/subjects`)
    const subjects: Subject[] = await subjectsResponse.json()
    
    // Find the specific subject
    const currentSubject = subjects.find(s => 
      s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === subjectSlug
    )
    
    const subjectName = currentSubject?.name || slugToSubject(subjectSlug)
    
    const title = `${subjectName} - ${branchData.name} | Brainreef`
    const description = `Access comprehensive study materials, notes, question papers, and resources for ${subjectName} in ${branchData.name} at Brainreef.`

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
      authors: [{ name: 'Brainreef' }],
      creator: 'Brainreef',
      publisher: 'Brainreef',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        title,
        description,
        url: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects/${subjectSlug}`,
        siteName: 'Brainreef',
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
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Subject - Brainreef',
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
