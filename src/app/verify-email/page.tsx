'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    // Verify email with the token
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage('Your email has been successfully verified!')
          
          // Redirect to login page with success parameter after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.error || 'Email verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            {status === 'loading' && (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <Alert 
            className={
              status === 'success' 
                ? 'border-green-200 bg-green-50' 
                : status === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-blue-200 bg-blue-50'
            }
          >
            {status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
            {status === 'loading' && <Mail className="h-4 w-4 text-blue-600" />}
            <AlertDescription 
              className={
                status === 'success'
                  ? 'text-green-700'
                  : status === 'error'
                  ? 'text-red-700'
                  : 'text-blue-700'
              }
            >
              {message || 'Please wait while we verify your email address...'}
            </AlertDescription>
          </Alert>

          {status === 'success' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                You will be redirected to the login page automatically, or click below to continue.
              </p>
              <Link href="/login?verified=true">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Continue to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Please try registering again or contact support if the problem persists.
              </p>
              <div className="flex gap-2">
                <Link href="/register" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Register Again
                  </Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-sm text-gray-600">
              This may take a few moments...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}