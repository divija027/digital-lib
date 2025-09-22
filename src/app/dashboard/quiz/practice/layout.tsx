import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MCQ Practice - BrainReef',
    description: 'Practice MCQ quizzes and test your knowledge with our comprehensive question sets.',
    keywords: 'MCQ, practice, quiz, test, engineering, VTU',
    openGraph: {
      title: 'MCQ Practice - BrainReef',
      description: 'Practice MCQ quizzes and test your knowledge with our comprehensive question sets.',
      type: 'website',
      siteName: 'BrainReef'
    }
  }
}

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout overrides the dashboard layout and removes the navbar
  // for a clean, distraction-free quiz experience
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}