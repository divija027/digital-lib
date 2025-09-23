import { useState, useCallback } from 'react'

export interface UploadError {
  type: 'validation' | 'network' | 'server' | 'r2' | 'unknown'
  message: string
  details?: any
}

export interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: UploadError
  fileKey?: string
  publicUrl?: string
}

interface UseFileUploadOptions {
  category?: string
  onSuccess?: (file: UploadFile) => void
  onError?: (file: UploadFile, error: UploadError) => void
  onProgress?: (file: UploadFile, progress: number) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const createError = (type: UploadError['type'], message: string, details?: any): UploadError => ({
    type,
    message,
    details,
  })

  const updateFile = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ))
  }, [])

  const uploadFile = useCallback(async (file: File): Promise<void> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const uploadFile: UploadFile = {
      id: fileId,
      file,
      progress: 0,
      status: 'pending',
    }

    setFiles(prev => [...prev, uploadFile])

    try {
      updateFile(fileId, { status: 'uploading', progress: 10 })

      // Get presigned URL
      const presignedResponse = await fetch('/api/r2/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          category: options.category || 'uploads',
        }),
      })

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json()
        throw createError('server', errorData.error || 'Failed to get upload URL', errorData.details)
      }

      const presignedData = await presignedResponse.json()
      
      if (!presignedData.success) {
        throw createError('server', presignedData.error || 'Failed to get upload URL')
      }

      updateFile(fileId, { progress: 30 })

      // Upload to R2 with progress tracking
      const xhr = new XMLHttpRequest()
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 70) + 30 // 30-100%
            updateFile(fileId, { progress })
            options.onProgress?.(uploadFile, progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const completedFile = {
              ...uploadFile,
              status: 'completed' as const,
              progress: 100,
              fileKey: presignedData.data.fileKey,
              publicUrl: presignedData.data.publicUrl,
            }
            updateFile(fileId, completedFile)
            options.onSuccess?.(completedFile)
            resolve()
          } else {
            const error = createError('r2', `Upload failed: ${xhr.statusText}`)
            updateFile(fileId, { status: 'error', error })
            options.onError?.(uploadFile, error)
            reject(error)
          }
        })

        xhr.addEventListener('error', () => {
          const error = createError('network', 'Network error during upload')
          updateFile(fileId, { status: 'error', error })
          options.onError?.(uploadFile, error)
          reject(error)
        })

        xhr.addEventListener('timeout', () => {
          const error = createError('network', 'Upload timeout')
          updateFile(fileId, { status: 'error', error })
          options.onError?.(uploadFile, error)
          reject(error)
        })

        xhr.open('PUT', presignedData.data.presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.timeout = 300000 // 5 minutes
        xhr.send(file)
      })

    } catch (error) {
      let uploadError: UploadError
      
      if (error instanceof Error) {
        uploadError = createError('unknown', error.message)
      } else if (typeof error === 'object' && error !== null && 'type' in error) {
        uploadError = error as UploadError
      } else {
        uploadError = createError('unknown', 'Unknown error occurred')
      }

      updateFile(fileId, { status: 'error', error: uploadError })
      options.onError?.(uploadFile, uploadError)
      throw uploadError
    }
  }, [options, updateFile])

  const uploadFiles = useCallback(async (files: File[]): Promise<void> => {
    setIsUploading(true)
    
    try {
      // Upload files concurrently with a limit
      const CONCURRENT_UPLOADS = 3
      const chunks = []
      
      for (let i = 0; i < files.length; i += CONCURRENT_UPLOADS) {
        chunks.push(files.slice(i, i + CONCURRENT_UPLOADS))
      }

      for (const chunk of chunks) {
        await Promise.allSettled(chunk.map(file => uploadFile(file)))
      }
    } finally {
      setIsUploading(false)
    }
  }, [uploadFile])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }, [])

  const retryFile = useCallback(async (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file || file.status !== 'error') return

    updateFile(id, { status: 'pending', error: undefined, progress: 0 })
    try {
      await uploadFile(file.file)
    } catch (error) {
      // Error handling is done in uploadFile
    }
  }, [files, uploadFile, updateFile])

  const clearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(file => file.status !== 'completed'))
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
  }, [])

  return {
    files,
    isUploading,
    uploadFile,
    uploadFiles,
    removeFile,
    retryFile,
    clearCompleted,
    clearAll,
    // Computed values
    completedFiles: files.filter(f => f.status === 'completed'),
    errorFiles: files.filter(f => f.status === 'error'),
    uploadingFiles: files.filter(f => f.status === 'uploading'),
    totalProgress: files.length > 0 
      ? files.reduce((sum, file) => sum + file.progress, 0) / files.length 
      : 0,
  }
}

// File validation hook
export function useFileValidation() {
  const validateFile = useCallback((file: File): UploadError | null => {
    const SUPPORTED_TYPES = {
      'image/jpeg': 10 * 1024 * 1024,
      'image/png': 10 * 1024 * 1024,
      'image/gif': 10 * 1024 * 1024,
      'image/webp': 10 * 1024 * 1024,
      'application/pdf': 25 * 1024 * 1024,
      'application/msword': 25 * 1024 * 1024,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 25 * 1024 * 1024,
      'application/vnd.ms-powerpoint': 25 * 1024 * 1024,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 25 * 1024 * 1024,
      'text/plain': 5 * 1024 * 1024,
      'text/markdown': 5 * 1024 * 1024,
    } as const

    if (!SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES]) {
      return {
        type: 'validation',
        message: `Unsupported file type: ${file.type}`,
      }
    }

    const maxSize = SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES]
    if (file.size > maxSize) {
      return {
        type: 'validation',
        message: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`,
      }
    }

    if (file.name.length > 255) {
      return {
        type: 'validation',
        message: 'Filename too long (max 255 characters)',
      }
    }

    if (!/^[a-zA-Z0-9._\-\s]+$/.test(file.name)) {
      return {
        type: 'validation',
        message: 'Filename contains invalid characters',
      }
    }

    return null
  }, [])

  const validateFiles = useCallback((files: File[]): { valid: File[], invalid: Array<{ file: File, error: UploadError }> } => {
    const valid: File[] = []
    const invalid: Array<{ file: File, error: UploadError }> = []

    for (const file of files) {
      const error = validateFile(file)
      if (error) {
        invalid.push({ file, error })
      } else {
        valid.push(file)
      }
    }

    return { valid, invalid }
  }, [validateFile])

  return {
    validateFile,
    validateFiles,
  }
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️'
  if (type === 'application/pdf') return '📄'
  if (type.includes('word')) return '📝'
  if (type.includes('powerpoint') || type.includes('presentation')) return '📊'
  if (type.includes('text')) return '📝'
  return '📁'
}

export const getFileTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
    'text/plain': 'Text File',
    'text/markdown': 'Markdown File',
  }
  
  return typeMap[type] || type
}