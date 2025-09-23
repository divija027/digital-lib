import { prisma } from '@/lib/prisma'
import { generateToken, EMAIL_EXPIRY } from '@/lib/email'

// Types for better type safety
interface TokenData {
  token: string
  expires: Date
}

interface UserTokenUpdate {
  emailVerificationToken?: string | null
  emailVerificationExpires?: Date | null
  passwordResetToken?: string | null
  passwordResetExpires?: Date | null
}

/**
 * Generates token expiry dates based on type
 */
export const getTokenExpiry = (type: 'verification' | 'reset'): Date => {
  const hours = type === 'verification' ? EMAIL_EXPIRY.VERIFICATION_HOURS : EMAIL_EXPIRY.RESET_HOURS
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

/**
 * Generates a new token with expiry date
 */
export const createToken = (type: 'verification' | 'reset'): TokenData => {
  return {
    token: generateToken(),
    expires: getTokenExpiry(type)
  }
}

/**
 * Updates user with verification token
 */
export const setVerificationToken = async (userId: string): Promise<TokenData> => {
  const tokenData = createToken('verification')
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: tokenData.token,
      emailVerificationExpires: tokenData.expires
    }
  })
  
  return tokenData
}

/**
 * Updates user with password reset token
 */
export const setPasswordResetToken = async (userId: string): Promise<TokenData> => {
  const tokenData = createToken('reset')
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: tokenData.token,
      passwordResetExpires: tokenData.expires
    }
  })
  
  return tokenData
}

/**
 * Finds user by verification token
 */
export const findUserByVerificationToken = async (token: string) => {
  return prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: {
        gt: new Date()
      }
    }
  })
}

/**
 * Finds user by password reset token
 */
export const findUserByResetToken = async (token: string) => {
  return prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gt: new Date()
      }
    }
  })
}

/**
 * Clears verification token and marks email as verified
 */
export const verifyUserEmail = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    }
  })
}

/**
 * Clears password reset token after successful reset
 */
export const clearPasswordResetToken = async (userId: string, newPasswordHash: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      password: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null
    }
  })
}

/**
 * Finds user by email and returns basic info (without sensitive data)
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true
    }
  })
}

export default {
  createToken,
  setVerificationToken,
  setPasswordResetToken,
  findUserByVerificationToken,
  findUserByResetToken,
  verifyUserEmail,
  clearPasswordResetToken,
  findUserByEmail,
  getTokenExpiry
}