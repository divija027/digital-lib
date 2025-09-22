/**
 * Quiz Components Export Index
 * 
 * This file provides a clean export interface for all quiz-related components,
 * making it easy for other developers to import and use the quiz system.
 */

// Main Components
export { RefactoredQuizInterface } from './RefactoredQuizInterface'
export { QuestionCard } from './QuestionCard'
export { ProgressSidebar } from './ProgressSidebar'
export { MobileNavigation } from './MobileNavigation'
export { QuizResults } from './QuizResults'

// Hooks
export { useQuizState, useQuizTimer, useQuizProgress } from './hooks'

// Types
export type {
  MCQQuestion,
  MCQSet,
  QuizState,
  QuizProgress,
  QuizResult,
  QuizInterfaceProps,
  DifficultyLevel
} from './types'