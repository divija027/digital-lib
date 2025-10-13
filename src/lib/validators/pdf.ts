/**
 * PDF Upload Validation Utilities
 * 
 * Reusable validation functions for PDF file uploads.
 * Can be used in both client and server components.
 */

import { 
  MAX_PDF_SIZE, 
  ALLOWED_MIME_TYPES,
  UPLOAD_ERROR_MESSAGES 
} from '@/lib/constants/upload'

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean
  error?: string
}

/**
 * PDF upload form data interface
 */
export interface PDFUploadData {
  file: File
  title: string
  description?: string | null
  branch: string
  semester: string
  subjectId: string
  featured?: boolean
}

/**
 * Validates if a file is a PDF
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFileType(file: File): ValidationResult {
  if (file.type !== ALLOWED_MIME_TYPES.PDF) {
    return {
      isValid: false,
      error: UPLOAD_ERROR_MESSAGES.INVALID_FILE_TYPE,
    }
  }
  return { isValid: true }
}

/**
 * Validates file size
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_PDF_SIZE) {
    return {
      isValid: false,
      error: UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE,
    }
  }
  return { isValid: true }
}

/**
 * Validates PDF file (type and size)
 * @param file - The file to validate
 * @returns Validation result
 */
export function validatePDFFile(file: File): ValidationResult {
  // Check file type
  const typeValidation = validateFileType(file)
  if (!typeValidation.isValid) {
    return typeValidation
  }

  // Check file size
  const sizeValidation = validateFileSize(file)
  if (!sizeValidation.isValid) {
    return sizeValidation
  }

  return { isValid: true }
}

/**
 * Validates required fields for PDF upload
 * @param data - Upload form data
 * @returns Validation result
 */
export function validateUploadFields(data: Partial<PDFUploadData>): ValidationResult {
  const requiredFields = ['file', 'title', 'branch', 'semester', 'subjectId']
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!data[field as keyof PDFUploadData]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `${UPLOAD_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS}: ${missingFields.join(', ')}`,
    }
  }

  return { isValid: true }
}

/**
 * Validates semester number
 * @param semester - Semester string to validate
 * @returns Validation result
 */
export function validateSemester(semester: string): ValidationResult {
  const semesterNum = parseInt(semester)
  
  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return {
      isValid: false,
      error: 'Semester must be between 1 and 8',
    }
  }

  return { isValid: true }
}

/**
 * Comprehensive validation for PDF upload
 * Combines all validation checks
 * @param data - Upload form data
 * @returns Validation result
 */
export function validatePDFUpload(data: Partial<PDFUploadData>): ValidationResult {
  // Validate required fields
  const fieldsValidation = validateUploadFields(data)
  if (!fieldsValidation.isValid) {
    return fieldsValidation
  }

  // Validate file
  if (data.file) {
    const fileValidation = validatePDFFile(data.file)
    if (!fileValidation.isValid) {
      return fileValidation
    }
  }

  // Validate semester
  if (data.semester) {
    const semesterValidation = validateSemester(data.semester)
    if (!semesterValidation.isValid) {
      return semesterValidation
    }
  }

  return { isValid: true }
}
