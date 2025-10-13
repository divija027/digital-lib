/**
 * Upload Configuration Constants
 * 
 * Central configuration for file upload limits, types, and R2 storage settings.
 * Used across both client and server components for consistent validation.
 */

/**
 * Maximum file size in bytes (25MB)
 * This limit applies to all PDF uploads
 */
export const MAX_PDF_SIZE = 25 * 1024 * 1024 // 25MB

/**
 * Allowed MIME types for upload
 */
export const ALLOWED_MIME_TYPES = {
  PDF: 'application/pdf',
} as const

/**
 * File extension to MIME type mapping
 */
export const FILE_EXTENSIONS = {
  '.pdf': ALLOWED_MIME_TYPES.PDF,
} as const

/**
 * Upload timeout settings
 */
export const UPLOAD_TIMEOUTS = {
  /** Maximum time for R2 upload operation (60 seconds) */
  R2_UPLOAD: 60,
  /** Maximum time for presigned URL generation (10 seconds) */
  PRESIGNED_URL: 10,
  /** Maximum time for download URL generation (1 hour) */
  DOWNLOAD_URL: 3600,
} as const

/**
 * R2 storage path structure
 * Pattern: pdfs/{branch}/{semester}/{uniqueId}.pdf
 */
export const R2_PATH_TEMPLATE = 'pdfs/{branch}/{semester}/{uniqueId}.pdf'

/**
 * Error messages for validation failures
 */
export const UPLOAD_ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Only PDF files are allowed',
  FILE_TOO_LARGE: `File size exceeds ${MAX_PDF_SIZE / (1024 * 1024)}MB limit`,
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  SUBJECT_NOT_FOUND: 'Subject not found. Please select a valid subject.',
  UPLOAD_FAILED: 'Failed to upload file to storage',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
} as const

/**
 * Success messages
 */
export const UPLOAD_SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'PDF uploaded successfully',
  UPDATE_SUCCESS: 'PDF updated successfully',
  DELETE_SUCCESS: 'PDF deleted successfully',
} as const

/**
 * Validation helper to format file size
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.45 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
