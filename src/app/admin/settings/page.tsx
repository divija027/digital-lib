'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  Globe,
  Shield,
  Database,
  Upload,
  Download,
  Users
} from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // General Settings
  const [siteName, setSiteName] = useState('VTU Digital Library')
  const [siteDescription, setSiteDescription] = useState('Comprehensive VTU study materials and resources')
  const [supportEmail, setSupportEmail] = useState('support@vtu-digital-lib.com')
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Upload Settings
  const [maxFileSize, setMaxFileSize] = useState(10)
  const [allowedFileTypes, setAllowedFileTypes] = useState('pdf,doc,docx,ppt,pptx')
  const [requireApproval, setRequireApproval] = useState(true)
  const [autoApproveAdmins, setAutoApproveAdmins] = useState(true)

  // User Settings
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireEmailVerification, setRequireEmailVerification] = useState(false)
  const [maxDownloadsPerDay, setMaxDownloadsPerDay] = useState(50)

  // Security Settings
  const [enableRateLimit, setEnableRateLimit] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(24)
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Mock API call - replace with actual implementation
      console.log(`Saving ${section} settings...`)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(`${section} settings saved successfully!`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to save ${section} settings`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system preferences and security settings</p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">
                    Enable to temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('General')}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Settings */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={maxFileSize}
                    onChange={(e) => setMaxFileSize(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={allowedFileTypes}
                    onChange={(e) => setAllowedFileTypes(e.target.value)}
                    placeholder="pdf,doc,docx,ppt,pptx"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-gray-500">
                    All uploads require admin approval before being visible
                  </p>
                </div>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Admin Uploads</Label>
                  <p className="text-sm text-gray-500">
                    Admin uploads are automatically approved
                  </p>
                </div>
                <Switch
                  checked={autoApproveAdmins}
                  onCheckedChange={setAutoApproveAdmins}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('Upload')}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Upload Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDownloads">Max Downloads per Day</Label>
                  <Input
                    id="maxDownloads"
                    type="number"
                    value={maxDownloadsPerDay}
                    onChange={(e) => setMaxDownloadsPerDay(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow User Registration</Label>
                  <p className="text-sm text-gray-500">
                    Allow new users to register for accounts
                  </p>
                </div>
                <Switch
                  checked={allowRegistration}
                  onCheckedChange={setAllowRegistration}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-gray-500">
                    Users must verify their email before accessing resources
                  </p>
                </div>
                <Switch
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('User')}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save User Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Rate Limiting</Label>
                  <p className="text-sm text-gray-500">
                    Limit API requests to prevent abuse
                  </p>
                </div>
                <Switch
                  checked={enableRateLimit}
                  onCheckedChange={setEnableRateLimit}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require 2FA for admin accounts (coming soon)
                  </p>
                </div>
                <Switch
                  checked={enableTwoFactor}
                  onCheckedChange={setEnableTwoFactor}
                  disabled
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('Security')}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Advanced Configuration
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        These settings require server restart and should only be modified by system administrators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Maintenance
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export System Data
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Configuration
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Database className="h-4 w-4 mr-2" />
                  Reset System (Danger)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Application Version</p>
                  <p className="text-gray-600">v1.0.0</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Database Version</p>
                  <p className="text-gray-600">PostgreSQL 15.3</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Node.js Version</p>
                  <p className="text-gray-600">v20.5.0</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Last Backup</p>
                  <p className="text-gray-600">2024-08-29 23:30:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
