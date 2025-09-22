/**
 * Type definitions for the MCQ Quiz system
 */

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type TimerMode = 'TOTAL_TIME' | 'PER_QUESTION'

export interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  hint?: string
  difficulty: DifficultyLevel
}

export interface MCQSet {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  timerMode: TimerMode
  totalTimeLimit?: number      // Total time for entire quiz in minutes (Option 1)
  questionTimeLimit?: number   // Time per question in seconds (Option 2)
  questions: MCQQuestion[]
}

export interface QuizState {
  currentQuestion: number
  selectedAnswers: (number | null)[]
  answeredQuestions: boolean[]
  showHint: boolean
  showExplanation: boolean
  isAnswered: boolean
  selectedAnswer: number | null
}

export interface QuizProgress {
  currentQuestion: number
  totalQuestions: number
  answeredCount: number
  remainingCount: number
  progressPercentage: number
}

export interface QuizResult {
  score: number
  correctAnswers: number
  totalQuestions: number
  answers: (number | null)[]
}

export interface QuizInterfaceProps {
  mcqSet: MCQSet
  onComplete: (score: number, answers: (number | null)[]) => void
  onExit: () => void
}