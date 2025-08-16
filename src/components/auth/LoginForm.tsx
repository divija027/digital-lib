'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, GraduationCap, XCircle, ArrowRight, KeyRound } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      // Store user data in localStorage (optional)
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      if (response.ok) {
        setForgotPasswordSent(true)
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Forgot Password Modal/Form
  if (showForgotPassword) {
    if (forgotPasswordSent) {    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2 sm:px-0">
                We've sent password reset instructions to <strong>{forgotPasswordEmail}</strong>
              </p>
            </div>
            <div className="pt-4 space-y-3">
              <Button 
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotPasswordSent(false)
                  setForgotPasswordEmail('')
                }}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      )
    }

    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-3 sm:pb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
          <CardTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2 sm:px-0">Enter your email to receive reset instructions</p>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgotEmail" className="text-gray-700 font-medium text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-9 sm:pl-10 h-10 sm:h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 bg-white/80 text-sm sm:text-base"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base" 
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowForgotPassword(false)
                setError('')
              }}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
      <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <CardTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">Sign in to access your learning dashboard</p>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-9 sm:pl-10 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 text-sm sm:text-base"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-9 sm:pl-10 pr-10 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 text-sm sm:text-base"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 sm:h-12 px-2 sm:px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-auto font-medium text-xs sm:text-sm"
            >
              Forgot your password?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign In
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
              Create one here
            </Link>
          </p>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 leading-relaxed px-2 sm:px-0">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
