import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            VTU Resources
          </h1>
          <p className="text-gray-600">
            Join thousands of VTU students accessing quality resources
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
