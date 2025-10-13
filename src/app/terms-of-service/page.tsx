import Link from 'next/link'
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Scale, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfServicePage() {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
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
              <AlertCircle className="w-5 h-5 text-green-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              By accessing and using Brainreef ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform. These terms apply to all users, 
              including students, educators, and administrators.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Acceptable Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">You May:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access study materials for personal educational purposes</li>
                <li>Take quizzes and track your academic progress</li>
                <li>Share your own notes and resources (with proper attribution)</li>
                <li>Collaborate with other students through our platform</li>
                <li>Download materials for offline studying</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">The following activities are strictly prohibited:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Sharing copyrighted materials without proper authorization</li>
              <li>Using the platform for commercial purposes without permission</li>
              <li>Attempting to hack, disrupt, or damage the service</li>
              <li>Creating multiple accounts to manipulate quiz scores or rankings</li>
              <li>Uploading malicious content, viruses, or spam</li>
              <li>Harassing, bullying, or threatening other users</li>
              <li>Selling or redistributing our content without authorization</li>
              <li>Using automated tools to scrape or download bulk content</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Platform Content</h3>
              <p className="text-gray-700">
                All content on Brainreef, including but not limited to text, graphics, logos, quizzes, and software, 
                is the property of Brainreef or its content suppliers and is protected by copyright laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">User-Generated Content</h3>
              <p className="text-gray-700 mb-2">
                When you upload content to Brainreef, you retain ownership but grant us a license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Display and distribute your content on our platform</li>
                <li>Make your content available to other users</li>
                <li>Create derivative works for educational purposes</li>
                <li>Use your content to improve our services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You must be at least 13 years old to use this service</li>
              <li>One person may only create one account</li>
              <li>You must notify us immediately of any unauthorized account access</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-orange-600" />
              Account Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your account if:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You violate these Terms of Service</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your account remains inactive for an extended period</li>
              <li>We are required to do so by law</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You may delete your account at any time through your account settings. Upon deletion, 
              your personal data will be removed in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Educational Content</h3>
              <p className="text-gray-700">
                While we strive to provide accurate and up-to-date educational content, we do not guarantee 
                the accuracy, completeness, or reliability of any content on the platform. Users should verify 
                information from official sources.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Limitation of Liability</h3>
              <p className="text-gray-700">
                Brainreef shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use of the service. Our total liability shall not exceed the amount 
                you paid for the service in the past 12 months.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We reserve the right to modify these Terms of Service at any time. We will notify users of 
              significant changes via email or through a notice on our platform. Your continued use of 
              Brainreef after changes constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the 
              courts in Bangalore, Karnataka.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Email:</strong> legal@brainreef.com</p>
              <p><strong>Support:</strong> support@brainreef.com</p>
              <p><strong>Address:</strong> Brainreef Education Services, Bangalore, Karnataka, India</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 font-semibold mb-2">
            By clicking "I Accept" during registration or by using our services, you acknowledge that you have 
            read, understood, and agree to be bound by these Terms of Service.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For questions or concerns, please review our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link> as well.
          </p>
        </div>
      </div>
    </div>
  )
}
