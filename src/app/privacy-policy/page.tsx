import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Last updated: October 13, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Welcome to Brainreef. We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website and use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name and email address when you create an account</li>
                <li>College/University information</li>
                <li>Academic branch and semester details</li>
                <li>Profile picture (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Quiz scores and performance metrics</li>
                <li>Study materials downloaded or viewed</li>
                <li>Time spent on the platform</li>
                <li>Device and browser information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To provide and maintain our educational services</li>
              <li>To personalize your learning experience</li>
              <li>To track your academic progress and provide insights</li>
              <li>To send you updates about new study materials and features</li>
              <li>To improve our platform based on usage patterns</li>
              <li>To ensure the security and integrity of our services</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Service Providers:</strong> With third-party vendors who help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
              <li><strong>Academic Institutions:</strong> With your college/university if you authorize us to do so</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure cloud storage infrastructure</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to enhance your experience. You can manage your 
              cookie preferences through our <Link href="/cookie-settings" className="text-blue-600 underline">Cookie Settings</Link> page.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Email:</strong> privacy@brainreef.com</p>
              <p><strong>Address:</strong> Brainreef Education Services, Bangalore, Karnataka, India</p>
              <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            By using Brainreef, you agree to this Privacy Policy. We may update this policy periodically, 
            and we will notify you of any significant changes.
          </p>
        </div>
      </div>
    </div>
  )
}
