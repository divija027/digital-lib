"use client"

import { PDFUpload } from '@/components/admin/PDFUpload'
import { PDFList } from '@/components/admin/PDFList'

export default function AdminPDFsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">PDF Management</h1>
        <p className="text-muted-foreground">
          Upload and manage study materials, notes, and question papers
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <PDFUpload />
        </div>
        <div className="lg:col-span-2">
          <PDFList />
        </div>
      </div>
    </div>
  )
}
