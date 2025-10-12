"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Download, Trash2, Eye, Star, Loader2 } from 'lucide-react'

interface PDF {
  id: string
  title: string
  description: string | null
  fileName: string
  fileSize: number
  r2Key: string
  branch: string
  semester: number
  featured: boolean
  downloads: number
  views: number
  createdAt: string
  subject: {
    id: string
    name: string
    code: string
  }
}

export function PDFList() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPDFs()
  }, [])

  const fetchPDFs = async () => {
    try {
      const response = await fetch('/api/admin/pdfs')
      if (response.ok) {
        const data = await response.json()
        setPdfs(data)
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PDF?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/pdfs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('PDF deleted successfully')
        fetchPDFs()
      } else {
        const error = await response.json()
        alert(`Failed to delete PDF: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting PDF:', error)
      alert('Failed to delete PDF')
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded PDFs</CardTitle>
        <CardDescription>
          Manage all uploaded study materials and resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pdfs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No PDFs uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Sem</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfs.map((pdf) => (
                  <TableRow key={pdf.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-medium">{pdf.title}</div>
                          {pdf.featured && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Featured</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{pdf.subject.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {pdf.subject.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pdf.branch}</TableCell>
                    <TableCell>{pdf.semester}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(pdf.fileSize)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="w-3 h-3" />
                        {pdf.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Download className="w-3 h-3" />
                        {pdf.downloads}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(pdf.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(pdf.id)}
                        disabled={deletingId === pdf.id}
                      >
                        {deletingId === pdf.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
