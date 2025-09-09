// Utility functions for branch code/slug conversion

// Cache for branch data to avoid repeated API calls
let branchCache: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchBranchData() {
  const now = Date.now()
  
  // Return cached data if it's still fresh
  if (branchCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return branchCache
  }
  
  try {
    // Use absolute URL for client-side, relative for server-side
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const response = await fetch(`${baseUrl}/api/admin/branches`)
    const data = await response.json()
    
    if (data.success) {
      branchCache = data.branches
      cacheTimestamp = now
      return data.branches
    }
  } catch (error) {
    console.error('Error fetching branches:', error)
  }
  
  return []
}

// Dynamic function to find branch code from slug
export async function getBranchCodeFromSlug(slug: string): Promise<string | null> {
  console.log(`[getBranchCodeFromSlug] Looking for slug: ${slug}`)
  const branches = await fetchBranchData()
  console.log(`[getBranchCodeFromSlug] Fetched ${branches.length} branches:`, branches.map((b: any) => ({ code: b.code, isActive: b.isActive })))
  
  // Default mapping for known branches
  const defaultMapping: Record<string, string> = {
    'physics': 'PHYSICS',
    'chemistry': 'CHEMISTRY',
    'cs': 'CSE',
    'cse': 'CSE',
    'is': 'ISE',
    'ise': 'ISE',
    'ece': 'ECE',
    'ai': 'AIML',
    'aiml': 'AIML',
    'eee': 'EEE',
    'civil': 'CE',
    'ce': 'CE',
    'mech': 'ME',
    'me': 'ME'
  }
  
  // First check default mapping
  if (defaultMapping[slug]) {
    console.log(`[getBranchCodeFromSlug] Found in default mapping: ${slug} -> ${defaultMapping[slug]}`)
    return defaultMapping[slug]
  }
  
  // Then check if any branch code matches the slug (case insensitive)
  const branch = branches.find((b: any) => 
    b.code.toLowerCase() === slug.toLowerCase() && b.isActive
  )
  
  if (branch) {
    console.log(`[getBranchCodeFromSlug] Found active branch: ${slug} -> ${branch.code}`)
    return branch.code
  }
  
  console.log(`[getBranchCodeFromSlug] No match found for slug: ${slug}`)
  return null
}

// Function to get slug from branch code (for routing)
export function getBranchSlug(branchCode: string): string {
  // Default mapping for known branches
  const defaultMapping: Record<string, string> = {
    'PHYSICS': 'physics',
    'CHEMISTRY': 'chemistry',
    'CSE': 'cs',
    'ISE': 'is', 
    'ECE': 'ece',
    'AIML': 'ai',
    'EEE': 'eee',
    'CE': 'civil',
    'ME': 'mech'
  }
  
  // Return default mapping if exists, otherwise create slug from branch code
  return defaultMapping[branchCode] || branchCode.toLowerCase()
}

// Clear cache (useful for testing or when branches are updated)
export function clearBranchCache() {
  console.log('[clearBranchCache] Clearing branch cache')
  branchCache = null
  cacheTimestamp = 0
}

// Convert subject name to URL-friendly slug
export function subjectToSlug(subjectName: string): string {
  return subjectName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}
