'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Upload, Download, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react'
import { useFileUpload, useFileValidation, formatFileSize, getFileIcon, getFileTypeLabel } from '@/hooks/useFileUpload'

const UPLOAD_CATEGORIES = [
  { value: 'documents', label: 'Documents' },
  { value: 'images', label: 'Images' },
  { value: 'resources', label: 'Resources' },
  { value: 'uploads', label: 'General Uploads' },
]

export default function UploadPage() {
  const [category, setCategory] = useState('uploads')
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { validateFiles } = useFileValidation()

  const {
    files,
    isUploading,
    uploadFiles,
    removeFile,
    retryFile,
    clearCompleted,
    clearAll,
    completedFiles,
    errorFiles,
    totalProgress,
  } = useFileUpload({
    category,
    onError: (file, error) => {
      console.error(`Upload failed for ${file.file.name}:`, error)
    },
    onSuccess: (file) => {
      console.log(`Upload completed for ${file.file.name}`)
    },
  })

  // Handle file drop/selection
  const handleFiles = useCallback(async (acceptedFiles: File[]) => {
    setGlobalError(null)

    if (acceptedFiles.length === 0) {
      setGlobalError('No valid files selected')
      return
    }

    // Validate files
    const { valid, invalid } = validateFiles(acceptedFiles)

    if (invalid.length > 0) {
      const errorMessages = invalid.map(({ file, error }) => `${file.name}: ${error.message}`)
      setGlobalError(`Validation errors:\n${errorMessages.join('\n')}`)
    }

    if (valid.length > 0) {
      try {
        await uploadFiles(valid)
      } catch (error) {
        setGlobalError('Some files failed to upload. Check individual file errors below.')
      }
    }
  }, [uploadFiles, validateFiles])

  // Delete file from R2 and local state
  const deleteFile = useCallback(async (fileId: string, fileKey?: string) => {
    try {
      if (fileKey) {
        const response = await fetch(`/api/r2/presigned-url?key=${encodeURIComponent(fileKey)}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete file from storage')
        }
      }
      removeFile(fileId)
    } catch (error) {
      console.error('Delete error:', error)
      setGlobalError('Failed to delete file from storage')
    }
  }, [removeFile])

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    disabled: isUploading,
    multiple: true,
    noClick: isUploading,
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Upload to Cloudflare R2</h1>
          <p className="text-gray-600 mt-2">
            Securely upload files using presigned URLs. Files are stored in Cloudflare R2 with public access.
          </p>
        </div>

        {/* Global Error Alert */}
        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{globalError}</AlertDescription>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setGlobalError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Upload Statistics */}
        {files.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {completedFiles.length} of {files.length} files uploaded
                  </p>
                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={totalProgress} className="h-2 w-48" />
                      <p className="text-xs text-gray-500">Overall progress: {Math.round(totalProgress)}%</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {completedFiles.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCompleted}>
                      Clear Completed
                    </Button>
                  )}
                  {files.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Settings</CardTitle>
            <CardDescription>
              Configure your upload preferences before selecting files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {UPLOAD_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Files will be organized under: <code>/{category}/</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dropzone */}
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${isUploading 
                  ? 'opacity-50 cursor-not-allowed border-gray-200' 
                  : 'cursor-pointer'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className={`mx-auto h-12 w-12 mb-4 ${isUploading ? 'text-gray-300' : 'text-gray-400'}`} />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {isUploading 
                    ? 'Uploading...' 
                    : isDragActive 
                      ? 'Drop files here' 
                      : 'Drag & drop files here'
                  }
                </p>
                {!isUploading && (
                  <>
                    <p className="text-gray-500">
                      or <span className="text-blue-600 font-medium">browse files</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Multiple files supported • Auto-validation • Progress tracking
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Queue</CardTitle>
              <CardDescription>
                Track your file uploads and manage completed files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((uploadFile) => (
                  <div 
                    key={uploadFile.id} 
                    className={`border rounded-lg p-4 transition-colors ${
                      uploadFile.status === 'error' ? 'border-red-200 bg-red-50' :
                      uploadFile.status === 'completed' ? 'border-green-200 bg-green-50' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl mt-1">{getFileIcon(uploadFile.file.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{uploadFile.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadFile.file.size)} • {getFileTypeLabel(uploadFile.file.type)}
                          </p>
                          
                          {/* Progress bar */}
                          {uploadFile.status === 'uploading' && (
                            <div className="mt-2 space-y-1">
                              <Progress value={uploadFile.progress} className="h-2" />
                              <p className="text-xs text-gray-500">
                                {uploadFile.progress}% • Uploading to R2...
                              </p>
                            </div>
                          )}

                          {/* Success details */}
                          {uploadFile.status === 'completed' && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-green-600 font-medium">✓ Upload completed</p>
                              <div className="text-xs text-gray-500 space-y-1">
                                <p>Key: <code className="bg-white px-1 rounded border">{uploadFile.fileKey}</code></p>
                                <a 
                                  href={uploadFile.publicUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-block"
                                >
                                  View public URL →
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Error details */}
                          {uploadFile.status === 'error' && uploadFile.error && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <span className="font-medium">{uploadFile.error.type}:</span> {uploadFile.error.message}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {uploadFile.status === 'completed' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(uploadFile.publicUrl, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteFile(uploadFile.id, uploadFile.fileKey)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {uploadFile.status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retryFile(uploadFile.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}

                        {uploadFile.status !== 'uploading' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Status indicator */}
                        {uploadFile.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {uploadFile.status === 'uploading' && (
                          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Summary */}
        {errorFiles.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Upload Errors</CardTitle>
              <CardDescription>
                {errorFiles.length} file(s) failed to upload. You can retry individual files above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {errorFiles.map((file) => (
                  <div key={file.id} className="text-sm">
                    <span className="font-medium">{file.file.name}:</span>{' '}
                    <span className="text-red-600">{file.error?.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supported File Types & Limits</CardTitle>
            <CardDescription>
              What you can upload and storage limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">📷 Images</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>JPEG, PNG, GIF, WebP</span>
                    <span className="font-medium">10MB max</span>
                  </div>
                  <p className="text-xs">Perfect for photos, graphics, and web images</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">📄 Documents</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>PDF, Word, PowerPoint</span>
                    <span className="font-medium">25MB max</span>
                  </div>
                  <p className="text-xs">Reports, presentations, and office documents</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">📝 Text Files</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>TXT, Markdown</span>
                    <span className="font-medium">5MB max</span>
                  </div>
                  <p className="text-xs">Code files, documentation, and plain text</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">🔒 Security & Privacy</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Files are uploaded directly to Cloudflare R2 using presigned URLs</li>
                <li>• Your server never handles the actual file content</li>
                <li>• All files get unique, non-guessable names</li>
                <li>• Public access URLs are generated for easy sharing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}