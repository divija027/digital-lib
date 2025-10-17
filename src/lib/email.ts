import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Types for better type safety
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  debug?: boolean
  logger?: boolean
  tls?: {
    ciphers: string
    rejectUnauthorized: boolean
  }
  authMethod?: string
}

interface EmailTemplate {
  subject: string
  html: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: unknown
}

// Constants
const EMAIL_CONFIG = {
  HOST: 'smtp.zoho.in',
  PORT: 587,
  SECURE: false,
  VERIFICATION_EXPIRY_HOURS: 24,
  RESET_EXPIRY_HOURS: 1,
} as const

/**
 * Creates and configures the email transporter for Zoho SMTP
 * @returns Configured nodemailer transporter
 */
const createTransporter = () => {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.')
  }

  const config: EmailConfig = {
    host: EMAIL_CONFIG.HOST,
    port: EMAIL_CONFIG.PORT,
    secure: EMAIL_CONFIG.SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Additional Zoho-specific configuration
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    authMethod: 'PLAIN'
  }

  // Add debug logging in development
  if (process.env.NODE_ENV === 'development') {
    config.debug = true
    config.logger = true
    
    console.log('Email transporter config:', {
      host: config.host,
      port: config.port,
      user: config.auth.user,
      hasPassword: !!config.auth.pass,
    })
  }

  return nodemailer.createTransport(config)
}

/**
 * Generates a secure random token for email verification and password reset
 * @returns Hex string token
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Creates email templates for verification and password reset
 * @param type - Type of email template
 * @param data - Template data
 * @returns Email template object
 */
const createEmailTemplate = (
  type: 'verification' | 'reset', 
  data: { name: string; token: string; baseUrl: string }
): EmailTemplate => {
  const { name, token, baseUrl } = data
  
  const baseStyles = {
    container: 'max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;',
    header: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;',
    content: 'padding: 40px 30px;',
    button: 'display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);',
    footer: 'background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;'
  }

  if (type === 'verification') {
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`
    
    return {
      subject: 'Verify Your Email - Brainreef',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="${baseStyles.container}">
            <div style="${baseStyles.header}">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Brainreef</h1>
              
            </div>
            
            <div style="${baseStyles.content}">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for signing up for Brainreef! Please verify your email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="${baseStyles.button}">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
              </p>
              
              <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                This verification link will expire in ${EMAIL_CONFIG.VERIFICATION_EXPIRY_HOURS} hours. If you didn't create an account with us, please ignore this email.
              </p>
            </div>
            
            <div style="${baseStyles.footer}">
              <p style="color: #888; margin: 0; font-size: 14px;">© ${new Date().getFullYear()} Brainreef. All rights reserved.</p>
              <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">This email was sent to ${name}.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  }

  // Password reset template
  const resetUrl = `${baseUrl}/reset-password?token=${token}`
  
  return {
    subject: 'Reset Your Password - Brainreef',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="${baseStyles.container}">
          <div style="${baseStyles.header}">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Brainreef</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="${baseStyles.content}">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${name}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="${baseStyles.button}">
                Reset Password
              </a>
            </div>
            
            <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              This password reset link will expire in ${EMAIL_CONFIG.RESET_EXPIRY_HOURS} hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
          
          <div style="${baseStyles.footer}">
            <p style="color: #888; margin: 0; font-size: 14px;">© ${new Date().getFullYear()} Brainreef. All rights reserved.</p>
            <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">This email was sent to ${name}.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

/**
 * Sends an email using the configured transporter
 * @param template - Email template
 * @param to - Recipient email address
 * @returns Promise with email result
 */
const sendEmail = async (template: EmailTemplate, to: string): Promise<EmailResult> => {
  try {
    const transporter = createTransporter()
    
    // Verify SMTP connection before sending (only in development)
    if (process.env.NODE_ENV === 'development') {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    }
    
    const result = await transporter.sendMail({
      from: `"Brainreef" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    })
    
    console.log(`Email sent successfully to ${to}:`, result.messageId)
    return { success: true, messageId: result.messageId }
    
  } catch (error) {
    console.error('Error sending email:', error)
    
    // Handle authentication errors specifically
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email credentials and ensure you are using an app-specific password.')
    }
    
    return { success: false, error }
  }
}

/**
 * Sends a verification email to the user
 * @param email - User's email address
 * @param name - User's name
 * @param token - Verification token
 * @returns Promise with email result
 */
export const sendVerificationEmail = async (
  email: string, 
  name: string, 
  token: string
): Promise<EmailResult> => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  console.log('🔍 Email Debug - NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('🔍 Email Debug - baseUrl being used:', baseUrl)
  console.log('🔍 Email Debug - NODE_ENV:', process.env.NODE_ENV)
  
  const template = createEmailTemplate('verification', { name, token, baseUrl })
  
  const result = await sendEmail(template, email)
  
  if (result.success) {
    console.log(`Verification email sent to: ${email}`)
  } else {
    console.error(`Failed to send verification email to: ${email}`)
  }
  
  return result
}

/**
 * Sends a password reset email to the user
 * @param email - User's email address
 * @param name - User's name
 * @param token - Reset token
 * @returns Promise with email result
 */
export const sendPasswordResetEmail = async (
  email: string, 
  name: string, 
  token: string
): Promise<EmailResult> => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  console.log('🔍 Password Reset Debug - NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('🔍 Password Reset Debug - baseUrl being used:', baseUrl)
  console.log('🔍 Password Reset Debug - NODE_ENV:', process.env.NODE_ENV)
  
  const template = createEmailTemplate('reset', { name, token, baseUrl })
  
  const result = await sendEmail(template, email)
  
  if (result.success) {
    console.log(`Password reset email sent to: ${email}`)
  } else {
    console.error(`Failed to send password reset email to: ${email}`)
  }
  
  return result
}

// Export email configuration constants for use in other modules
export const EMAIL_EXPIRY = {
  VERIFICATION_HOURS: EMAIL_CONFIG.VERIFICATION_EXPIRY_HOURS,
  RESET_HOURS: EMAIL_CONFIG.RESET_EXPIRY_HOURS,
} as const

// Default export for backwards compatibility
const emailService = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateToken,
  EMAIL_EXPIRY
}

export default emailService