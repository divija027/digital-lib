/**
 * QuizResults component for displaying detailed quiz analysis
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Home,
  TrendingUp,
  Award,
  Brain,
  AlertCircle
} from 'lucide-react'
import { MCQSet, QuizResult } from './types'

interface QuizResultsProps {
  mcqSet: MCQSet
  result: QuizResult
  onRetryQuiz: () => void
  onBackToQuizzes: () => void
}

export function QuizResults({ 
  mcqSet, 
  result, 
  onRetryQuiz, 
  onBackToQuizzes 
}: QuizResultsProps) {
  const { score, correctAnswers, totalQuestions, answers } = result
  const incorrectAnswers = totalQuestions - correctAnswers
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  // Performance levels
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (score >= 60) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  const performance = getPerformanceLevel(score)

  // Question-wise analysis
  const questionAnalysis = mcqSet.questions.map((question, index) => ({
    questionNumber: index + 1,
    question: question.question,
    userAnswer: answers[index],
    correctAnswer: question.correctAnswer,
    isCorrect: answers[index] === question.correctAnswer,
    options: question.options,
    explanation: question.explanation,
    difficulty: question.difficulty
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      {/* Home Link */}
      <div className="absolute top-4 right-4 z-50">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600">
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-xl text-gray-600">{mcqSet.title}</p>
        </div>

        {/* Overall Results Card */}
        <Card className="mb-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <CardTitle className="text-2xl font-bold text-center">Your Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Score */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600">{score}%</div>
                <div className="text-gray-600 font-medium">Overall Score</div>
              </div>

              {/* Correct Answers */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-gray-600 font-medium">Correct</div>
              </div>

              {/* Incorrect Answers */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-gray-600 font-medium">Incorrect</div>
              </div>

              {/* Accuracy */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-gray-600 font-medium">Accuracy</div>
              </div>
            </div>

            {/* Performance Level */}
            <div className={`${performance.bgColor} border border-gray-200 rounded-2xl p-6 mb-6`}>
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className={`w-8 h-8 ${performance.color} mr-3`} />
                <span className={`text-2xl font-bold ${performance.color}`}>
                  {performance.level}
                </span>
              </div>
              <div className="text-center">
                <Progress value={score} className="h-4 mb-2" />
                <p className="text-gray-600">
                  You scored {score}% on this quiz. 
                  {score >= 75 ? ' Great job!' : score >= 60 ? ' Good effort, keep practicing!' : ' Don\'t worry, practice makes perfect!'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onRetryQuiz}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={onBackToQuizzes}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg font-semibold rounded-2xl hover:shadow-md transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Card className="bg-white border-0 shadow-xl rounded-3xl">
          <CardHeader className="p-6 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-blue-600" />
              Question-wise Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {questionAnalysis.map((qa, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-2xl p-6 ${
                    qa.isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        qa.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {qa.questionNumber}
                      </div>
                      <Badge className={`${
                        qa.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                        qa.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {qa.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {qa.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">{qa.question}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {qa.options.map((option, optionIndex) => {
                      const isUserAnswer = qa.userAnswer === optionIndex
                      const isCorrectAnswer = qa.correctAnswer === optionIndex
                      
                      let optionClass = 'p-3 rounded-lg border-2 '
                      if (isCorrectAnswer) {
                        optionClass += 'border-green-300 bg-green-100 text-green-800'
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        optionClass += 'border-red-300 bg-red-100 text-red-800'
                      } else {
                        optionClass += 'border-gray-200 bg-gray-50 text-gray-600'
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                              {isUserAnswer && <span className="text-xs font-bold">Your Answer</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {qa.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-blue-900 mb-2">Explanation</h5>
                          <p className="text-blue-800">{qa.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}