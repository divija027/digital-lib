import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BookOpen, Download, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">VTU Resources</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Gateway to
            <span className="text-blue-600"> VTU Resources</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access thousands of question papers, study materials, and previous year papers 
            for VTU University. Everything you need to excel in your academics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Learning Today
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Browse Resources
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Download className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle>Free Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Download all resources completely free. No hidden charges or premium subscriptions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4">
                <BookOpen className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>Comprehensive Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Question papers, study materials, syllabus, and notes for all VTU subjects and semesters.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle>Student Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join thousands of VTU students and contribute to the learning community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Academic Performance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join VTU Resources today and get instant access to all study materials.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">VTU Resources</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering VTU students with quality educational resources.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/login" className="text-gray-400 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-white">
                Register
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Resources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
