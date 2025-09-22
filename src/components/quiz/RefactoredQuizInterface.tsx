/**
 * RefactoredQuizInterface - Modern, maintainable quiz component
 * 
 * This component provides a clean, professional quiz interface with:
 * - Modular component architecture
 * - Custom hooks for state management
 * - TypeScript for type safety
 * - Responsive design with mobile support
 * - Clear separation of concerns
 */

'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Import types and hooks
import { QuizInterfaceProps } from './types'
import { useQuizState, useQuizTimer, useQuizProgress } from './hooks'

// Import components
import { QuestionCard } from './QuestionCard'
import { ProgressSidebar } from './ProgressSidebar'
import { MobileNavigation } from './MobileNavigation'
import { ConfirmationDialog } from './ConfirmationDialog'

/**
 * Main Quiz Interface Component
 * 
 * Manages the overall quiz experience including:
 * - Question display and interaction
 * - Progress tracking and navigation
 * - Timer functionality
 * - Quiz completion handling
 */
export function RefactoredQuizInterface({ 
  mcqSet, 
  onComplete, 
  onExit 
}: QuizInterfaceProps) {
  const router = useRouter()

  // State for confirmation dialogs
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    type: 'exit' | 'earlyFinish' | 'finish'
    onConfirm: () => void
  }>({
    isOpen: false,
    type: 'exit',
    onConfirm: () => {}
  })

  // State for navigation warning
  const [showNavigationWarning, setShowNavigationWarning] = useState(false)

  // Function to show navigation warning
  const showWarning = (message: string) => {
    setShowNavigationWarning(true)
    setTimeout(() => setShowNavigationWarning(false), 3000)
  }

  // Custom hooks for state management
  const {
    quizState,
    selectAnswer,
    goToNext,
    goToPrevious,
    jumpToQuestion,
    toggleHint,
    calculateResult,
    currentQuestion
  } = useQuizState(mcqSet)

  // Timer hook with auto-advance on timeout
  const { timeLeft, timerMode, isPerQuestionMode } = useQuizTimer(
    mcqSet,
    quizState.isAnswered,
    () => {
      // Auto-advance when time runs out
      if (isPerQuestionMode) {
        // For per-question mode, advance to next question or finish
        if (quizState.currentQuestion < mcqSet.questions.length - 1) {
          goToNext()
        } else {
          handleQuizCompleteWithConfirmation()
        }
      } else {
        // For total time mode, finish the entire quiz
        handleQuizCompleteWithConfirmation()
      }
    },
    quizState.currentQuestion // Pass current question to reset timer for per-question mode
  )

  // Progress calculation
  const progress = useQuizProgress(quizState, mcqSet.questions.length)

  // Block browser navigation (back button, refresh, etc.)
  useEffect(() => {
    // Prevent browser back button
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      // Push current state again to prevent going back
      window.history.pushState(null, '', window.location.href)
      
      // Show warning to user
      showWarning('Please use the Exit Quiz button to leave the quiz safely.')
    }

    // Prevent browser refresh and tab close
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    // Prevent keyboard shortcuts (F5, Ctrl+R, etc.)
    const handleKeyDown = (event: KeyboardEvent) => {
      // More comprehensive refresh blocking
      const isRefreshKey = event.key === 'F5' || 
                          (event.ctrlKey && (event.key === 'r' || event.key === 'R')) ||
                          (event.ctrlKey && event.key === 'F5') ||
                          (event.metaKey && (event.key === 'r' || event.key === 'R')) // Mac Command+R
      
      if (isRefreshKey) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        showWarning('Refresh is disabled during quiz. Please use Exit Quiz button to leave.')
        return false
      }
      
      // Prevent Alt+Left (back button)
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        showWarning('Navigation is disabled during quiz. Please use Exit Quiz button to leave.')
        return false
      }
      
      // Prevent Backspace navigation (when not in input)
      if (event.key === 'Backspace' && 
          !(event.target as HTMLElement)?.tagName.match(/INPUT|TEXTAREA/)) {
        event.preventDefault()
        return
      }

      // Prevent common developer tools shortcuts
      if (event.key === 'F12' || 
          (event.ctrlKey && event.shiftKey && event.key === 'I') ||
          (event.ctrlKey && event.shiftKey && event.key === 'C') ||
          (event.ctrlKey && event.shiftKey && event.key === 'J') ||
          (event.ctrlKey && event.key === 'U')) {
        event.preventDefault()
        showWarning('Developer tools are disabled during quiz for security.')
        return
      }
    }

    // Prevent mouse navigation buttons
    const handleMouseDown = (event: MouseEvent) => {
      // Prevent mouse back/forward buttons (button 3 = back, button 4 = forward)
      if (event.button === 3 || event.button === 4) {
        event.preventDefault()
        showWarning('Navigation is disabled during quiz. Please use Exit Quiz button to leave.')
        return
      }
    }

    // Prevent right-click context menu
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    // Add initial history state
    window.history.pushState(null, '', window.location.href)
    
    // Add event listeners with capture to catch events early
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    window.addEventListener('keydown', handleKeyDown, true) // Also on window
    document.body.addEventListener('keydown', handleKeyDown, true) // Also on body
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keydown', handleKeyDown, true)
      document.body.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  /**
   * Handle next question navigation
   */
  const handleNext = () => {
    const isFinished = goToNext()
    if (isFinished) {
      handleQuizCompleteWithConfirmation()
    }
  }

  /**
   * Handle exit confirmation with detailed message
   */
  const handleExit = () => {
    setConfirmationDialog({
      isOpen: true,
      type: 'exit',
      onConfirm: () => {
        onExit()
      }
    })
  }

  /**
   * Handle quiz completion and score calculation
   */
  const handleQuizComplete = () => {
    const result = calculateResult()
    onComplete(result.score, result.answers)
  }

  /**
   * Handle quiz completion with confirmation
   */
  const handleQuizCompleteWithConfirmation = () => {
    setConfirmationDialog({
      isOpen: true,
      type: 'finish',
      onConfirm: () => {
        handleQuizComplete()
      }
    })
  }

  /**
   * Handle early quiz finish with confirmation
   */
  const handleEarlyFinish = () => {
    setConfirmationDialog({
      isOpen: true,
      type: 'earlyFinish',
      onConfirm: () => {
        handleQuizComplete()
      }
    })
  }
  
  // Navigation state
  const canGoBack = quizState.currentQuestion > 0
  const canGoNext = quizState.isAnswered || (isPerQuestionMode && timeLeft === 0)
  const isLastQuestion = quizState.currentQuestion === mcqSet.questions.length - 1
  const hasAnsweredAtLeastOne = quizState.answeredQuestions.some(answered => answered)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleExit}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Quiz
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mcqSet.title}</h1>
              <p className="text-gray-600">{mcqSet.description}</p>
            </div>
          </div>
          
          {/* Home Link */}
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question Content - Left Side */}
          <div className="lg:col-span-8">
            <QuestionCard
              question={currentQuestion}
              questionNumber={quizState.currentQuestion + 1}
              selectedAnswer={quizState.selectedAnswer}
              isAnswered={quizState.isAnswered}
              showHint={quizState.showHint}
              showExplanation={quizState.showExplanation}
              timeLeft={timeLeft}
              timerMode={timerMode}
              onAnswerSelect={selectAnswer}
              onToggleHint={toggleHint}
            />
          </div>

          {/* Progress & Navigation Sidebar - Right Side */}
          <ProgressSidebar
            progress={progress}
            answeredQuestions={quizState.answeredQuestions}
            selectedAnswers={quizState.selectedAnswers}
            questions={mcqSet.questions}
            onQuestionJump={jumpToQuestion}
            onPrevious={goToPrevious}
            onNext={handleNext}
            onFinishQuiz={handleEarlyFinish}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isAnswered={quizState.isAnswered}
            isLastQuestion={isLastQuestion}
            hasAnsweredAtLeastOne={hasAnsweredAtLeastOne}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          progress={progress}
          answeredQuestions={quizState.answeredQuestions}
          selectedAnswers={quizState.selectedAnswers}
          questions={mcqSet.questions}
          onQuestionJump={jumpToQuestion}
          onPrevious={goToPrevious}
          onNext={handleNext}
          onFinishQuiz={handleEarlyFinish}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLastQuestion={isLastQuestion}
          hasAnsweredAtLeastOne={hasAnsweredAtLeastOne}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        type={confirmationDialog.type}
        answeredCount={quizState.answeredQuestions.filter(Boolean).length}
        totalQuestions={mcqSet.questions.length}
      />

      {/* Navigation Warning Toast */}
      {showNavigationWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="font-medium">🚫 Navigation Blocked</span>
          </div>
          <div className="text-sm mt-1 opacity-90">
            Use "Exit Quiz" button to leave safely
          </div>
        </div>
      )}
    </div>
  )
}