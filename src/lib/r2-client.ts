import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// Configuration interface for type safety
export interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
  endpoint: string
  publicUrl: string
}

// Get R2 configuration from environment variables
export function getR2Config(): R2Config {
  const config = {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucketName: process.env.R2_BUCKET_NAME!,
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    publicUrl: process.env.R2_PUBLIC_URL!,
  }

  // Validate that all required environment variables are present
  const missingVars = Object.entries(config)
    .filter(([key, value]) => !value && key !== 'region')
    .map(([key]) => `R2_${key.toUpperCase()}`)

  if (missingVars.length > 0) {
    throw new Error(`Missing required R2 environment variables: ${missingVars.join(', ')}`)
  }

  return config
}

// Initialize S3 client for Cloudflare R2
export function createR2Client(): S3Client {
  const config = getR2Config()

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // Force path-style URLs for R2 compatibility
    forcePathStyle: true,
  })
}

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  // Images
  'image/jpeg': { ext: 'jpg', maxSize: 10 * 1024 * 1024 }, // 10MB
  'image/png': { ext: 'png', maxSize: 10 * 1024 * 1024 },  // 10MB
  'image/gif': { ext: 'gif', maxSize: 10 * 1024 * 1024 },  // 10MB
  'image/webp': { ext: 'webp', maxSize: 10 * 1024 * 1024 }, // 10MB
  
  // Documents
  'application/pdf': { ext: 'pdf', maxSize: 25 * 1024 * 1024 }, // 25MB
  'application/msword': { ext: 'doc', maxSize: 25 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', maxSize: 25 * 1024 * 1024 },
  'application/vnd.ms-powerpoint': { ext: 'ppt', maxSize: 25 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'pptx', maxSize: 25 * 1024 * 1024 },
  
  // Text files
  'text/plain': { ext: 'txt', maxSize: 5 * 1024 * 1024 }, // 5MB
  'text/markdown': { ext: 'md', maxSize: 5 * 1024 * 1024 },
} as const

export type SupportedMimeType = keyof typeof SUPPORTED_FILE_TYPES

// File validation function
export function validateFile(file: { type: string; size: number; name: string }) {
  const mimeType = file.type as SupportedMimeType
  
  if (!SUPPORTED_FILE_TYPES[mimeType]) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }

  const { maxSize } = SUPPORTED_FILE_TYPES[mimeType]
  if (file.size > maxSize) {
    throw new Error(`File size exceeds limit. Maximum size for ${file.type} is ${Math.round(maxSize / (1024 * 1024))}MB`)
  }

  // Additional filename validation
  if (!file.name || file.name.length === 0) {
    throw new Error('File name is required')
  }

  if (file.name.length > 255) {
    throw new Error('File name too long (maximum 255 characters)')
  }

  // Check for potentially dangerous file names
  const dangerousPattern = /[<>:"/\\|?*\x00-\x1f]/
  if (dangerousPattern.test(file.name)) {
    throw new Error('File name contains invalid characters')
  }

  return true
}

// Generate unique file key for R2
export function generateFileKey(originalName: string, category: string = 'uploads'): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { nanoid } = require('nanoid')
  const timestamp = Date.now()
  const randomId = nanoid(10)
  
  // Create a safe filename
  const safeName = originalName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
  
  return `${category}/${timestamp}-${randomId}-${safeName}`
}

// R2 Operations Interface
export interface R2Operations {
  generatePresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>
  generatePresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>
  deleteFile(key: string): Promise<void>
  getPublicUrl(key: string): string
}

// R2 operations class
export class R2Service implements R2Operations {
  private client: S3Client
  private config: R2Config

  constructor() {
    this.config = getR2Config()
    this.client = createR2Client()
    
    // Debug logging
    console.log('R2Service initialized with config:', {
      bucketName: this.config.bucketName,
      region: this.config.region,
      endpoint: this.config.endpoint,
      publicUrl: this.config.publicUrl,
      hasAccessKey: !!this.config.accessKeyId,
      hasSecretKey: !!this.config.secretAccessKey,
    })
  }

  async generatePresignedUploadUrl(
    key: string, 
    contentType: string, 
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      ContentType: contentType,
    })

    return await getSignedUrl(this.client, command, { expiresIn })
  }

  async generatePresignedDownloadUrl(
    key: string, 
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    })

    return await getSignedUrl(this.client, command, { expiresIn })
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    })

    await this.client.send(command)
  }

  getPublicUrl(key: string): string {
    // For R2 with public access, construct direct URL
    return `${this.config.publicUrl}/${key}`
  }
}

// Singleton instance
let r2Service: R2Service | null = null

export function getR2Service(): R2Service {
  if (!r2Service) {
    r2Service = new R2Service()
  }
  return r2Service
}

// Helper function to get file info from URL/key
export function parseFileKey(key: string) {
  const parts = key.split('/')
  const filename = parts[parts.length - 1]
  const category = parts.slice(0, -1).join('/')
  
  return {
    category,
    filename,
    key,
  }
}

// Error types for better error handling
export class R2Error extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message)
    this.name = 'R2Error'
  }
}

export class R2ValidationError extends R2Error {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'R2ValidationError'
  }
}

export class R2ConfigError extends R2Error {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR', 500)
    this.name = 'R2ConfigError'
  }
}