import { Metadata } from 'next'
import { getBranchCodeFromSlug } from '@/lib/branch-utils'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ branch: string }> 
}): Promise<Metadata> {
  const { branch: branchSlug } = await params
  
  const branchCode = await getBranchCodeFromSlug(branchSlug)
  
  if (!branchCode) {
    return {
      title: 'Subjects Not Found - Brainreef',
      description: 'The requested subjects could not be found.'
    }
  }

  // Fetch branch data from API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/branches`)
    const branches = await response.json()
    const branchData = branches.find((b: any) => b.code === branchCode)
    
    if (!branchData) {
      return {
        title: 'Subjects Not Found - Brainreef',
        description: 'The requested subjects could not be found.'
      }
    }

    const title = `${branchData.name} Subjects | Brainreef`
    const description = `Browse all subjects and study materials for ${branchData.name} at Brainreef. Access comprehensive notes, question papers, and resources.`

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
      url: `https://vtu-digital-library.com/dashboard/${branchSlug}/subjects`,
      siteName: 'Brainreef',
      images: [
        {
          url: 'https://vtu-digital-library.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${branchData.name} Subjects - Brainreef`,
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
  } catch (error) {
    console.error('Error fetching branch data:', error)
    return {
      title: 'Subjects - Brainreef',
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
