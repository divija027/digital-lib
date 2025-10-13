import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Floating Elements - Hide on small screens */}
      <div className="hidden sm:block absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-xl"></div>
      <div className="hidden sm:block absolute top-40 right-32 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl"></div>
      <div className="hidden sm:block absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-xl"></div>
      <div className="hidden sm:block absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center group">
              <img 
                src="/logocropped.jpg" 
                alt="BrainReef Logo" 
                className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105 duration-300 drop-shadow-md"
                style={{ mixBlendMode: 'multiply', filter: 'contrast(1.1) brightness(1.05)' }}
              />
            </Link>
            
            <div className="mt-4 sm:mt-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">
                Access study materials, question papers, and more
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
