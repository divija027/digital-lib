import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'VTU Academic Dashboard - BrainReef',
    description: 'Access comprehensive VTU question papers and study resources for all engineering branches and foundation cycles.',
    keywords: 'VTU, study materials, engineering, academic, dashboard, resources',
    openGraph: {
      title: 'VTU Academic Dashboard - BrainReef',
      description: 'Access comprehensive VTU question papers and study resources for all engineering branches.',
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
