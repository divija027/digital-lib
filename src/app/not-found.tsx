'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, 
  ArrowLeft,
  Home,
  Search,
  ChevronRight
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  const popularRoutes = [
    { name: 'Computer Science', path: '/dashboard/cs', icon: '💻' },
    { name: 'Information Science', path: '/dashboard/is', icon: '🌐' },
    { name: 'Electronics & Communication', path: '/dashboard/ece', icon: '📡' },
    { name: 'Physics Cycle', path: '/dashboard/physics/subjects', icon: '⚛️' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* 404 Header */}
          <div className="space-y-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>

          {/* Popular Routes */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Popular Academic Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularRoutes.map((route) => (
                <Card 
                  key={route.path}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 border-l-blue-500"
                  onClick={() => router.push(route.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{route.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{route.name}</h4>
                          <p className="text-sm text-gray-500">Browse subjects and modules</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you believe this is an error or you're having trouble finding what you're looking for, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button variant="outline">Report Issue</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
