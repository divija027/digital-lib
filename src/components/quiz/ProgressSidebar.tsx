/**
 * ProgressSidebar component for displaying quiz progress and navigation
 */

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QuizProgress } from './types'

interface ProgressSidebarProps {
  progress: QuizProgress
  answeredQuestions: boolean[]
  selectedAnswers: (number | null)[]
  questions: any[] // Add questions to check correct answers
  onQuestionJump: (questionIndex: number) => void
  onPrevious: () => void
  onNext: () => void
  onFinishQuiz: () => void
  canGoBack: boolean
  canGoNext: boolean
  isAnswered: boolean
  isLastQuestion: boolean
  hasAnsweredAtLeastOne: boolean
}

export function ProgressSidebar({
  progress,
  answeredQuestions,
  selectedAnswers,
  questions,
  onQuestionJump,
  onPrevious,
  onNext,
  onFinishQuiz,
  canGoBack,
  canGoNext,
  isAnswered,
  isLastQuestion,
  hasAnsweredAtLeastOne
}: ProgressSidebarProps) {
  return (
    <div className="lg:col-span-4">
      <div className="sticky top-24 space-y-6">
        {/* Progress Card */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {progress.currentQuestion + 1} of {progress.totalQuestions}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(progress.progressPercentage)}% Complete
                </span>
              </div>
              <div className="relative">
                <Progress value={progress.progressPercentage} className="h-3 bg-gray-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full pointer-events-none"></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.answeredCount}
                </div>
                <div className="text-xs text-gray-600">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {progress.remainingCount}
                </div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation Card */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
            
            {/* Question Numbers Navigation */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: progress.totalQuestions }, (_, i) => {
                const isCurrentQuestion = i === progress.currentQuestion
                const isAnswered = answeredQuestions[i]
                const selectedAnswer = selectedAnswers[i]
                const correctAnswer = questions[i]?.correctAnswer
                const isCorrect = isAnswered && selectedAnswer === correctAnswer
                const isIncorrect = isAnswered && selectedAnswer !== correctAnswer
                
                let buttonClass = 'aspect-square rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-110 '
                
                if (isCurrentQuestion) {
                  buttonClass += 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                } else if (isCorrect) {
                  buttonClass += 'bg-green-500 text-white shadow-md shadow-green-200 hover:bg-green-600'
                } else if (isIncorrect) {
                  buttonClass += 'bg-red-500 text-white shadow-md shadow-red-200 hover:bg-red-600'
                } else {
                  buttonClass += 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }

                return (
                  <button
                    key={i}
                    onClick={() => onQuestionJump(i)}
                    className={buttonClass}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!canGoBack}
                className={`w-full justify-start ${
                  !canGoBack 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={onNext}
                className={`w-full justify-start ${
                  !canGoNext
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
                disabled={!canGoNext}
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Early Finish Option */}
              {!isLastQuestion && hasAnsweredAtLeastOne && (
                <Button
                  onClick={onFinishQuiz}
                  variant="outline"
                  className="w-full justify-center border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 hover:shadow-md transition-all duration-300"
                >
                  Finish Quiz Early
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}