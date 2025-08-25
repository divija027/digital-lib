import { MetadataRoute } from 'next'
import { getAllBranches, getAllCycles } from '@/lib/vtu-curriculum'

// Branch to slug mapping
const BRANCH_TO_SLUG: Record<string, string> = {
  'PHYSICS': 'physics',
  'CHEMISTRY': 'chemistry',
  'CSE': 'cs',
  'ISE': 'is', 
  'ECE': 'ece',
  'AIML': 'ai',
  'EEE': 'eee',
  'CE': 'civil',
  'ME': 'mech'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com' // Replace with your actual domain
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Add branch routes
  const allBranches = getAllBranches()
  const allCycles = getAllCycles()
  
  // Add cycle routes
  allCycles.forEach(cycle => {
    const slug = BRANCH_TO_SLUG[cycle.code]
    if (slug) {
      const cycleSlug = cycle.code === 'PHYSICS' ? 'physics-cycle' : 'chemistry-cycle'
      
      routes.push({
        url: `${baseUrl}/dashboard/${slug}/semester/${cycleSlug}/subjects`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  })

  // Add branch routes
  allBranches.forEach(branch => {
    const slug = BRANCH_TO_SLUG[branch.code]
    if (slug) {
      // Branch overview
      routes.push({
        url: `${baseUrl}/dashboard/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })

      // Semester routes (3-7 for branches)
      for (let sem = 3; sem <= 7; sem++) {
        routes.push({
          url: `${baseUrl}/dashboard/${slug}/semester/${sem}/subjects`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })

        // Add subject routes
        const semesterData = branch.semesters.find(s => s.semester === sem)
        if (semesterData) {
          semesterData.subjects.forEach(subject => {
            const subjectSlug = subject.name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-')
              .replace(/^-+|-+$/g, '')
            
            routes.push({
              url: `${baseUrl}/dashboard/${slug}/semester/${sem}/subject/${subjectSlug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.6,
            })
          })
        }
      }
    }
  })

  return routes
}
