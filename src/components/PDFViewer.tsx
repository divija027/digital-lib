'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, ExternalLink } from 'lucide-react'

interface PDFViewerProps {
  fileUrl: string
  fileName: string
  onClose: () => void
}

export function PDFViewer({ fileUrl, fileName, onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl.replace('?view=true', '')
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = () => {
    window.open(`${fileUrl}?view=true`, '_blank')
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError('')
  }

  const handleIframeError = () => {
    setError('Failed to load PDF. Please try downloading the file or opening in a new tab.')
    setIsLoading(false)
  }

  // Create the view URL
  const viewUrl = `${fileUrl}?view=true`

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold truncate max-w-md">{fileName}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={openInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center bg-white p-8 rounded-lg shadow max-w-md">
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button onClick={openInNewTab} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          <iframe
            src={viewUrl}
            className="w-full h-full border-0"
            title={fileName}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    </div>
  )
}
