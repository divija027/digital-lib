import { useState, useEffect } from 'react'
import { getAllBranches, BranchData } from '@/lib/vtu-curriculum'

interface Subject {
  name: string
  slug: string
  description: string
}

interface UseSubjectsReturn {
  subjects: Subject[]
  loading: boolean
  error: string | null
}

export const useSubjects = (): UseSubjectsReturn => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setLoading(true)
      
      // Extract unique branch names from VTU curriculum
      const branches = getAllBranches()
      const branchSubjects = branches.map((branch: BranchData) => ({
        name: branch.name,
        slug: branch.code.toLowerCase(),
        description: `Complete study materials & papers for ${branch.name}`
      }))

      setSubjects(branchSubjects)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subjects'
      setError(errorMessage)
      console.error('Error loading subjects:', err)
      
      // Fallback to hardcoded subjects if VTU curriculum fails
      setSubjects(getFallbackSubjects())
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    subjects,
    loading,
    error
  }
}

// Fallback subjects if VTU curriculum is not available
export const getFallbackSubjects = (): Subject[] => [
  {
    name: 'Computer Science & Engineering',
    slug: 'cse',
    description: 'Complete study materials & papers for Computer Science & Engineering'
  },
  {
    name: 'Electronics & Communication',
    slug: 'ece',
    description: 'Complete study materials & papers for Electronics & Communication'
  },
  {
    name: 'Mechanical Engineering',
    slug: 'me',
    description: 'Complete study materials & papers for Mechanical Engineering'
  },
  {
    name: 'Civil Engineering',
    slug: 'ce',
    description: 'Complete study materials & papers for Civil Engineering'
  },
  {
    name: 'Information Science',
    slug: 'ise',
    description: 'Complete study materials & papers for Information Science'
  },
  {
    name: 'Electrical Engineering',
    slug: 'ee',
    description: 'Complete study materials & papers for Electrical Engineering'
  }
]