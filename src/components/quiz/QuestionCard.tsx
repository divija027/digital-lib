/**
 * QuestionCard component for displaying quiz questions
 */

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  X,
  Timer
} from 'lucide-react'
import { MCQQuestion } from './types'

interface QuestionCardProps {
  question: MCQQuestion
  questionNumber: number
  selectedAnswer: number | null
  isAnswered: boolean
  showHint: boolean
  showExplanation: boolean
  timeLeft: number
  timerMode: 'TOTAL_TIME' | 'PER_QUESTION'
  onAnswerSelect: (answerIndex: number) => void
  onToggleHint: () => void
}

/**
 * Formats time in MM:SS format
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Gets difficulty color based on level
 */
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'BEGINNER': return 'bg-green-100 text-green-800'
    case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
    case 'ADVANCED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  isAnswered,
  showHint,
  showExplanation,
  timeLeft,
  timerMode,
  onAnswerSelect,
  onToggleHint
}: QuestionCardProps) {
  return (
    <Card className="bg-white border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold">
              Question {questionNumber}
            </div>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
            timeLeft <= 30 
              ? 'bg-red-100 text-red-600' 
              : timeLeft <= 60 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-green-100 text-green-600'
          }`}>
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
            <span className="text-xs ml-1 opacity-75">
              {timerMode === 'PER_QUESTION' ? '/ question' : '/ total'}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctAnswer
            const showResult = isAnswered && showExplanation
            
            let buttonClass = 'w-full p-4 text-left border-2 rounded-xl transition-all duration-300 hover:shadow-md '
            
            if (showResult) {
              if (isCorrect) {
                buttonClass += 'bg-green-50 border-green-300 text-green-800'
              } else if (isSelected && !isCorrect) {
                buttonClass += 'bg-red-50 border-red-300 text-red-800'
              } else {
                buttonClass += 'bg-gray-50 border-gray-200 text-gray-600'
              }
            } else if (isSelected) {
              buttonClass += 'bg-blue-50 border-blue-300 text-blue-800 shadow-lg'
            } else {
              buttonClass += 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
            }

            return (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                  {showResult && (
                    <div className="flex items-center gap-2">
                      {isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Hint Section */}
        {question.hint && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={onToggleHint}
              className="mb-3 flex items-center gap-2 hover:shadow-md transition-all duration-300"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 font-medium">{question.hint}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explanation Section */}
        {isAnswered && showExplanation && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Explanation
            </h4>
            <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}