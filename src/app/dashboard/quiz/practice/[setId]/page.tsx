'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain,
  Trophy,
  Target,
  Clock,
  Star,
  ChevronRight,
  Play,
  TrendingUp,
  Users,
  Award,
  Zap,
  BookOpen,
  Code,
  Calculator,
  MessageCircle,
  Building,
  Lock,
  CheckCircle,
  Crown,
  Sparkles,
  ArrowRight,
  BarChart3,
  Flame,
  Home,
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  Timer,
  CheckCircle2,
  X,
  RotateCcw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MCQSet {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  timeLimit: number
  questions: MCQQuestion[]
}

interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: string
  // Legacy properties for compatibility with existing UI
  text?: string
  choices?: string[]
  correctIndex?: number
  hint?: string
  solution?: string
  company?: string
}

interface MCQPracticeProps {
  params: Promise<{
    setId: string
  }>
}

export default function MCQPractice({ params }: MCQPracticeProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90) // 90 seconds per question
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSet, setCurrentSet] = useState<MCQSet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentQ = currentSet?.questions[currentQuestion]

  // Fetch MCQ set and questions from API
  useEffect(() => {
    const fetchMCQSet = async () => {
      try {
        setIsLoading(true)
        
        const { setId } = await params
        
        // Fetch MCQ set details
        const setResponse = await fetch(`/api/mcq/sets/${setId}`)
        if (!setResponse.ok) {
          throw new Error('MCQ set not found')
        }
        const setData = await setResponse.json()
        
        // Fetch questions for this set
        const questionsResponse = await fetch(`/api/mcq/questions?mcqSetId=${setId}`)
        if (!questionsResponse.ok) {
          throw new Error('Questions not found')
        }
        const questionsResult = await questionsResponse.json()
        
        // Handle the API response structure
        const questionsData = questionsResult.questions || []
        
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
          throw new Error('No questions found for this MCQ set')
        }
        
        const mcqSet: MCQSet = {
          id: setData.id,
          title: setData.title,
          description: setData.description,
          difficulty: setData.difficulty,
          category: setData.category,
          timeLimit: setData.timeLimit,
          questions: questionsData.map((q: { id: string; question: string; options: string[]; correctAnswer: number; explanation?: string; difficulty?: string }) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty || 'Medium',
            // Map to legacy properties for compatibility
            text: q.question,
            choices: q.options,
            correctIndex: q.correctAnswer,
            hint: q.explanation || "No hint available",
            solution: q.explanation || "No solution available",
            company: "VTU" // Default company
          }))
        }
        
        setCurrentSet(mcqSet)
        setUserAnswers(new Array(mcqSet.questions.length).fill(null))
        setTimeLeft(90)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load MCQ set')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMCQSet()
    setIsVisible(true)
  }, [params])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && quizStarted) {
      handleNext()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, quizCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (!currentSet) return
    
    if (currentQuestion < currentSet.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(userAnswers[currentQuestion + 1])
      setShowHint(false)
      setShowSolution(false)
      setTimeLeft(90)
    } else {
      // Calculate final score
      const correctAnswers = userAnswers.reduce((acc: number, answer, index) => {
        if (!currentSet || answer === null) return acc
        return acc + (answer === (currentSet.questions[index].correctIndex ?? currentSet.questions[index].correctAnswer) ? 1 : 0)
      }, 0)
      setScore(Math.round((correctAnswers / currentSet.questions.length) * 100))
      setQuizCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(userAnswers[currentQuestion - 1])
      setShowHint(false)
      setShowSolution(false)
      setTimeLeft(90)
    }
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(90)
  }

  const handleRestartQuiz = () => {
    if (!currentSet) return
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setUserAnswers(new Array(currentSet.questions.length).fill(null))
    setShowHint(false)
    setShowSolution(false)
    setTimeLeft(90)
    setQuizStarted(false)
    setQuizCompleted(false)
    setScore(0)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading Quiz...</h1>
          <p className="text-gray-600">Please wait while we prepare your questions</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Quiz</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/quiz">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!currentSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">MCQ Set Not Found</h1>
          <Link href="/quiz">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</CardTitle>
            <p className="text-gray-600 text-lg">{currentSet.title}</p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">{score}%</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {userAnswers.filter((answer, index) => answer === currentSet.questions[index].correctIndex).length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600 mb-1">{currentSet.questions.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRestartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Link href="/quiz">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Selection
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/quiz" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Selection</span>
            </Link>
          </div>

          {/* Quiz Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader className="text-center pb-6">
              <Badge className="mx-auto mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Ready to Start
              </Badge>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{currentSet.title}</CardTitle>
              <p className="text-gray-600 text-lg">{currentSet.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-blue-50 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{currentSet.timeLimit}</div>
                  <div className="text-sm text-gray-600">Minutes Total</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl p-6">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{currentSet.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-6">
                  <Timer className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">90</div>
                  <div className="text-sm text-gray-600">Seconds/Question</div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Start Quiz Now
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/quiz" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">{currentSet.title}</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                timeLeft <= 30 
                  ? 'bg-red-100 text-red-700 animate-pulse' 
                  : timeLeft <= 60 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-blue-50 text-blue-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="text-sm tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-3 py-1.5 font-medium">
                {currentQuestion + 1} of {currentSet.questions.length}
              </Badge>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(((currentQuestion + 1) / currentSet.questions.length) * 100)}%
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={((currentQuestion + 1) / currentSet.questions.length) * 100} 
                className="h-3 bg-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Question Card */}
        <Card className="bg-white border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1.5 font-medium">
                  {currentQ?.company || 'VTU'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1.5 font-medium ${
                    (currentQ?.difficulty || 'Medium') === 'Easy' || (currentQ?.difficulty || 'Medium') === 'BEGINNER'
                      ? 'border-green-200 text-green-700 bg-green-50'
                      : (currentQ?.difficulty || 'Medium') === 'Medium' || (currentQ?.difficulty || 'Medium') === 'INTERMEDIATE'
                      ? 'border-yellow-200 text-yellow-700 bg-yellow-50'
                      : 'border-red-200 text-red-700 bg-red-50'
                  }`}
                >
                  {currentQ?.difficulty || 'Medium'}
                </Badge>
              </div>
              <div className="flex gap-2">
                {(currentQ?.hint || currentQ?.explanation) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className={`transition-all duration-300 ${
                      showHint 
                        ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                        : 'text-orange-600 border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 mr-1.5" />
                    Hint
                  </Button>
                )}
                {(currentQ?.solution || currentQ?.explanation) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                    className={`transition-all duration-300 ${
                      showSolution
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                        : 'text-green-600 border-green-200 hover:bg-green-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 mr-1.5" />
                    Explanation
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed mb-2">
                    Question {currentQuestion + 1}
                  </CardTitle>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {currentQ?.text || currentQ?.question || 'Question not available'}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Answer Choices */}
            <div className="space-y-4">
              {(currentQ?.choices || currentQ?.options || []).map((choice: string, index: number) => {
                const optionLabels = ['A', 'B', 'C', 'D']
                const isSelected = selectedAnswer === index
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`group w-full text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 shadow-lg shadow-blue-100'
                        : 'border-gray-200 group-hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        {/* Option Label */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }`}>
                          {optionLabels[index]}
                        </div>
                        
                        {/* Option Text */}
                        <div className="flex-1 pt-1">
                          <p className={`text-base leading-relaxed transition-colors duration-300 ${
                            isSelected 
                              ? 'text-blue-900 font-medium' 
                              : 'text-gray-800'
                          }`}>
                            {choice}
                          </p>
                        </div>
                        
                        {/* Selection Indicator */}
                        <div className={`flex-shrink-0 transition-all duration-300 ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Border Glow */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-indigo-400/10 pointer-events-none" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-2 text-base">💡 Hint</h4>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      {currentQ?.hint || currentQ?.explanation || 'Think carefully about the key concepts involved in this question.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2 text-base">✅ Explanation</h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                      {currentQ?.solution || currentQ?.explanation || 'The correct answer can be determined by applying the fundamental principles covered in this topic.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-8 py-3 font-medium transition-all duration-300 ${
                  currentQuestion === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex-1 text-center">
                <div className="text-sm text-gray-600 mb-3 font-medium">
                  Question {currentQuestion + 1} of {currentSet.questions.length}
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {Array.from({ length: currentSet.questions.length }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentQuestion(i)
                        setSelectedAnswer(userAnswers[i])
                        setShowHint(false)
                        setShowSolution(false)
                        setTimeLeft(90)
                      }}
                      className={`w-8 h-8 rounded-full font-semibold text-xs transition-all duration-300 hover:scale-110 ${
                        i === currentQuestion
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : userAnswers[i] !== null
                          ? 'bg-green-500 text-white shadow-md shadow-green-200 hover:bg-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 font-medium transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {currentQuestion === currentSet.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
