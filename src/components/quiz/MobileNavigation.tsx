/**
 * MobileNavigation component for quiz navigation on mobile devices
 */

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QuizProgress } from './types'

interface MobileNavigationProps {
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
  isLastQuestion: boolean
  hasAnsweredAtLeastOne: boolean
}

export function MobileNavigation({
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
  isLastQuestion,
  hasAnsweredAtLeastOne
}: MobileNavigationProps) {
  return (
    <div className="lg:hidden mt-8">
      <Card className="bg-white border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Progress: {progress.currentQuestion + 1} of {progress.totalQuestions}
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

          {/* Question Numbers Navigation */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {Array.from({ length: progress.totalQuestions }, (_, i) => {
              const isCurrentQuestion = i === progress.currentQuestion
              const isAnswered = answeredQuestions[i]
              const selectedAnswer = selectedAnswers[i]
              const correctAnswer = questions[i]?.correctAnswer
              const isCorrect = isAnswered && selectedAnswer === correctAnswer
              const isIncorrect = isAnswered && selectedAnswer !== correctAnswer
              
              let buttonClass = 'w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-110 '
              
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
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoBack}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                !canGoBack 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-md hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">
                {progress.answeredCount} of {progress.totalQuestions} answered
              </div>
            </div>
            
            <Button
              onClick={onNext}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                !canGoNext
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
              disabled={!canGoNext}
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Early Finish Option for Mobile */}
          {!isLastQuestion && hasAnsweredAtLeastOne && (
            <div className="mt-4 text-center">
              <Button
                onClick={onFinishQuiz}
                variant="outline"
                className="px-8 py-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 hover:shadow-md transition-all duration-300"
              >
                Finish Quiz Early
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}