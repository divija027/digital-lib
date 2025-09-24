import { useState, useCallback } from 'react'

/**
 * Blog Image Upload Hook
 * 
 * Provides functionality for uploading images to Cloudflare R2 storage
 * with support for dual upload methods:
 * 1. Direct upload via presigned URLs (preferred)
 * 2. Proxy upload through server (fallback)
 * 
 * Features:
 * - Progress tracking
 * - File validation
 * - Error handling
 * - Image management (add/remove)
 */

export interface BlogImage {
  id: string
  key: string
  publicUrl: string
  fileName: string
  fileSize: number
  status: 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

export interface UseBlogImageUploadOptions {
  onSuccess?: (image: BlogImage) => void
  onError?: (image: BlogImage, error: string) => void
  onProgress?: (image: BlogImage, progress: number) => void
}

export function useBlogImageUpload(options: UseBlogImageUploadOptions = {}) {
  const [images, setImages] = useState<BlogImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const generateImageId = useCallback(() => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const validateImageFile = useCallback((file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP images are allowed'
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return 'Image size must be less than 10MB'
    }

    // Check filename
    if (!file.name || file.name.length === 0) {
      return 'File name is required'
    }

    if (file.name.length > 255) {
      return 'File name is too long (maximum 255 characters)'
    }

    return null
  }, [])

  const uploadImage = useCallback(async (file: File): Promise<BlogImage | null> => {
    const imageId = generateImageId()
    
    const validationError = validateImageFile(file)
    if (validationError) {
      const errorImage: BlogImage = {
        id: imageId,
        key: '',
        publicUrl: '',
        fileName: file.name,
        fileSize: file.size,
        status: 'error',
        progress: 0,
        error: validationError,
      }
      
      setImages(prev => [...prev, errorImage])
      options.onError?.(errorImage, validationError)
      return null
    }

    const initialImage: BlogImage = {
      id: imageId,
      key: '',
      publicUrl: '',
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading',
      progress: 0,
    }

    setImages(prev => [...prev, initialImage])
    setIsUploading(true)

    try {
      return await uploadWithPresignedUrl(file, imageId, initialImage)
    } catch (error) {
      try {
        return await uploadWithProxy(file, imageId, initialImage)
      } catch (proxyError) {
        const errorMessage = proxyError instanceof Error ? proxyError.message : 'Upload failed'
        
        const errorImage: BlogImage = {
          id: imageId,
          key: '',
          publicUrl: '',
          fileName: file.name,
          fileSize: file.size,
          status: 'error',
          progress: 0,
          error: errorMessage,
        }

        setImages(prev => prev.map(img => 
          img.id === imageId ? errorImage : img
        ))

        options.onError?.(errorImage, errorMessage)
        return null
      }
    } finally {
      setIsUploading(false)
    }
  }, [generateImageId, validateImageFile, options])

  const uploadWithPresignedUrl = useCallback(async (
    file: File, 
    imageId: string, 
    initialImage: BlogImage
  ): Promise<BlogImage> => {
    const presignedResponse = await fetch('/api/blog/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      }),
    })

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json()
      throw new Error(errorData.error || 'Failed to get upload URL')
    }

    const { data } = await presignedResponse.json()
    const { presignedUrl, publicUrl, key } = data
    
    const uploadPromise = new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          
          setImages(prev => prev.map(img => 
            img.id === imageId 
              ? { ...img, progress, key, publicUrl }
              : img
          ))
          
          const updatedImage = { ...initialImage, progress, key, publicUrl }
          options.onProgress?.(updatedImage, progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error during upload'))
      }

      xhr.ontimeout = () => {
        reject(new Error('Upload timeout'))
      }

      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.timeout = 60000
      xhr.send(file)
    })

    await uploadPromise

    const completedImage: BlogImage = {
      id: imageId,
      key,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
      status: 'completed',
      progress: 100,
    }

    setImages(prev => prev.map(img => 
      img.id === imageId ? completedImage : img
    ))

    options.onSuccess?.(completedImage)
    return completedImage
  }, [options])

  const uploadWithProxy = useCallback(async (
    file: File, 
    imageId: string, 
    initialImage: BlogImage
  ): Promise<BlogImage> => {
    const formData = new FormData()
    formData.append('file', file)

    const uploadPromise = new Promise<{ publicUrl: string; key: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          
          setImages(prev => prev.map(img => 
            img.id === imageId 
              ? { ...img, progress }
              : img
          ))
          
          const updatedImage = { ...initialImage, progress }
          options.onProgress?.(updatedImage, progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              resolve(response.data)
            } else {
              reject(new Error(response.error || 'Proxy upload failed'))
            }
          } catch (e) {
            reject(new Error('Invalid response from proxy upload'))
          }
        } else {
          reject(new Error(`Proxy upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error during proxy upload'))
      }

      xhr.open('POST', '/api/blog/images/proxy')
      xhr.send(formData)
    })

    const { publicUrl, key } = await uploadPromise

    const completedImage: BlogImage = {
      id: imageId,
      key,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
      status: 'completed',
      progress: 100,
    }

    setImages(prev => prev.map(img => 
      img.id === imageId ? completedImage : img
    ))

    options.onSuccess?.(completedImage)
    return completedImage
  }, [options])

  const uploadMultipleImages = useCallback(async (files: File[]): Promise<BlogImage[]> => {
    setIsUploading(true)
    
    const results = await Promise.allSettled(
      files.map(file => uploadImage(file))
    )
    
    const uploadedImages = results
      .filter((result): result is PromiseFulfilledResult<BlogImage> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
    
    setIsUploading(false)
    return uploadedImages
  }, [uploadImage])

  const removeImage = useCallback(async (imageId: string): Promise<boolean> => {
    const image = images.find(img => img.id === imageId)
    if (!image) return false

    try {
      if (image.status === 'completed' && image.key) {
        const deleteResponse = await fetch(`/api/blog/images?key=${encodeURIComponent(image.key)}`, {
          method: 'DELETE',
        })

        if (!deleteResponse.ok) {
          // Continue anyway to remove from local state
        }
      }

      setImages(prev => prev.filter(img => img.id !== imageId))
      return true
    } catch (error) {
      return false
    }
  }, [images])

  const clearAllImages = useCallback(() => {
    setImages([])
  }, [])

  const getCompletedImages = useCallback(() => {
    return images.filter(img => img.status === 'completed')
  }, [images])

  const getFailedImages = useCallback(() => {
    return images.filter(img => img.status === 'error')
  }, [images])

  return {
    images,
    isUploading,
    uploadImage,
    uploadMultipleImages,
    removeImage,
    clearAllImages,
    getCompletedImages,
    getFailedImages,
    validateImageFile,
  }
}