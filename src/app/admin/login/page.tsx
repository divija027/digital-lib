'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BookOpen, Eye, EyeOff, Shield, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Strict validation: Only specific emails allowed
        const allowedEmails = ['admin@gmail.com', 'superadmin@gmail.com']
        const allowedRoles = ['ADMIN', 'SUPERADMIN']
        
        if (!allowedEmails.includes(data.user.email) || !allowedRoles.includes(data.user.role)) {
          setError('Access denied. You are not authorized to access the admin panel.')
          // Clear any stored token for non-admin users
          await fetch('/api/auth/logout', { method: 'POST' })
          return
        }
        
        // Additional verification using admin-specific endpoint
        const adminVerifyResponse = await fetch('/api/auth/admin/verify', {
          credentials: 'include'
        })
        
        if (!adminVerifyResponse.ok) {
          setError('Admin verification failed. Access denied.')
          await fetch('/api/auth/logout', { method: 'POST' })
          return
        }
        
        toast.success(`Welcome ${data.user.name || 'Admin'}!`)
        router.push('/admin')
      } else {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.')
        } else {
          setError(data.error || 'Login failed')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-blue-200">Secure login for authorized administrators</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-blue-200 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Brainreef - Admin Portal</span>
          </div>
          <p className="text-xs text-blue-300 mt-2">
            Authorized access only. All activities are monitored.
          </p>
        </div>
      </div>
    </div>
  )
}