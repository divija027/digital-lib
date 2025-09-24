'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResendForm = z.infer<typeof resendSchema>

export default function ResendVerificationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendForm>({
    resolver: zodResolver(resendSchema),
  })

  const onSubmit = async (data: ResendForm) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(result.error || 'Failed to resend verification email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We've sent a new verification link to your email address. Please check your inbox and click the link to verify your account.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Resend Verification Email
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email to receive a new verification link
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}