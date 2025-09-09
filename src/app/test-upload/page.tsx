'use client'

import { UploadDropzone } from '@/utils/uploadthing'

export default function UploadTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">UploadThing Test</h1>
      <div className="max-w-lg">
        <UploadDropzone
          endpoint="questionPaperUploader"
          onClientUploadComplete={(res) => {
            console.log("✅ Files uploaded:", res);
            alert("Upload successful!");
          }}
          onUploadError={(error: Error) => {
            console.error("❌ Upload error:", error);
            alert(`Upload error: ${error.message}`);
          }}
          onUploadBegin={(name) => {
            console.log("🚀 Upload starting:", name);
          }}
        />
      </div>
    </div>
  )
}
