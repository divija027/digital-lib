/**
 * Generate a simple browser fingerprint for tracking unique users
 * This creates a hash based on browser characteristics
 */
export function generateUserFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side'
  }

  // Check if fingerprint is already stored in localStorage
  const stored = localStorage.getItem('userFingerprint')
  if (stored) {
    return stored
  }

  // Create fingerprint from browser characteristics
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let canvasFingerprint = ''
  
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('fingerprint', 2, 2)
    canvasFingerprint = canvas.toDataURL().slice(-50)
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint,
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform,
  ]

  // Create a simple hash
  const fingerprint = simpleHash(components.join('|||'))
  
  // Store for future use
  localStorage.setItem('userFingerprint', fingerprint)
  
  return fingerprint
}

/**
 * Simple hash function to create a unique string
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return 'fp_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36)
}
