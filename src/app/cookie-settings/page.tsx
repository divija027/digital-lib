'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Cookie, Check, X, Settings, Info, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function CookieSettingsPage() {
  const [essentialCookies, setEssentialCookies] = useState(true)
  const [functionalCookies, setFunctionalCookies] = useState(true)
  const [analyticsCookies, setAnalyticsCookies] = useState(false)
  const [marketingCookies, setMarketingCookies] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    const preferences = {
      essential: essentialCookies,
      functional: functionalCookies,
      analytics: analyticsCookies,
      marketing: marketingCookies,
    }
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAcceptAll = () => {
    setFunctionalCookies(true)
    setAnalyticsCookies(true)
    setMarketingCookies(true)
    handleSavePreferences()
  }

  const handleRejectAll = () => {
    setFunctionalCookies(false)
    setAnalyticsCookies(false)
    setMarketingCookies(false)
    handleSavePreferences()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Cookie Settings</h1>
              <p className="text-gray-600 mt-2">Manage your cookie preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Save Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Your cookie preferences have been saved!</p>
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              About Cookies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              understanding how you use our platform, and improving our services.
            </p>
          </CardContent>
        </Card>

        {/* Essential Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Essential Cookies
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="essential" className="text-sm font-normal text-gray-600">
                  Always Active
                </Label>
                <Switch
                  id="essential"
                  checked={essentialCookies}
                  disabled={true}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality 
              such as security, authentication, and network management. You cannot opt-out of these cookies.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Authentication tokens (keeps you logged in)</li>
                <li>Security cookies (prevents CSRF attacks)</li>
                <li>Load balancing cookies (distributes traffic)</li>
                <li>Session cookies (maintains your session)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Functional Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                Functional Cookies
              </CardTitle>
              <Switch
                id="functional"
                checked={functionalCookies}
                onCheckedChange={setFunctionalCookies}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              These cookies enable enhanced functionality and personalization. They may be set by us or 
              third-party providers whose services we use on our pages.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Language preferences</li>
                <li>Theme settings (dark/light mode)</li>
                <li>Video player preferences</li>
                <li>Saved filters and sorting preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Analytics Cookies
              </CardTitle>
              <Switch
                id="analytics"
                checked={analyticsCookies}
                onCheckedChange={setAnalyticsCookies}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and 
              reporting information anonymously. This helps us improve our platform.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Google Analytics (visitor statistics)</li>
                <li>Page view tracking</li>
                <li>Time spent on pages</li>
                <li>Quiz completion rates</li>
                <li>Feature usage metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-orange-600" />
                Marketing Cookies
              </CardTitle>
              <Switch
                id="marketing"
                checked={marketingCookies}
                onCheckedChange={setMarketingCookies}
                className="data-[state=checked]:bg-orange-600"
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              These cookies are used to deliver advertisements that are relevant to you and your interests. 
              They also help measure the effectiveness of advertising campaigns.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Targeted advertising</li>
                <li>Social media sharing</li>
                <li>Retargeting campaigns</li>
                <li>Advertisement performance tracking</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleSavePreferences}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Save My Preferences
          </Button>
          <Button
            onClick={handleAcceptAll}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Accept All Cookies
          </Button>
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <X className="w-5 h-5 mr-2" />
            Reject Optional Cookies
          </Button>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>More Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              For more details about how we use cookies and protect your privacy, please review our:
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy">
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Privacy Policy →
                </Button>
              </Link>
              <Link href="/terms-of-service">
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Terms of Service →
                </Button>
              </Link>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> You can change your cookie preferences at any time by returning to this page. 
                Your browser may also have settings to control or delete cookies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
