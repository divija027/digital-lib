import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'VTU Academic Dashboard - BrainReef',
    description: 'Access comprehensive VTU study materials, modules, and resources for all engineering branches and foundation cycles.',
    keywords: 'VTU, study materials, engineering, academic, dashboard, resources',
    openGraph: {
      title: 'VTU Academic Dashboard - BrainReef',
      description: 'Access comprehensive VTU study materials, modules, and resources for all engineering branches.',
      type: 'website',
      siteName: 'BrainReef'
    }
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
