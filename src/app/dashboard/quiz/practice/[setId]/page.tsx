'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefactoredQuizInterface, QuizResults } from '@/components/quiz'
import type { MCQSet, MCQQuestion, QuizResult } from '@/components/quiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target,
  ArrowLeft,
  Brain,
  Timer,
  Play,
  ArrowRight,
  X,
  Home
} from 'lucide-react'

interface MCQPracticeProps {
  params: Promise<{
    setId: string
  }>
}

export default function MCQPractice({ params }: MCQPracticeProps) {
  const router = useRouter()
  const [currentSet, setCurrentSet] = useState<MCQSet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [setId, setSetId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load quiz state from sessionStorage on mount
  useEffect(() => {
    const loadSavedState = async () => {
      const { setId: paramSetId } = await params
      setSetId(paramSetId)
      setIsInitialized(true)
    }
    
    loadSavedState()
  }, [params])

  useEffect(() => {
    const fetchMCQSet = async () => {
      if (!setId) return
      
      try {
        setIsLoading(true)
        
        const setResponse = await fetch(`/api/mcq/sets/${setId}`)
        if (!setResponse.ok) throw new Error('MCQ set not found')
        const setData = await setResponse.json()
        
        const questionsResponse = await fetch(`/api/mcq/questions?mcqSetId=${setId}`)
        if (!questionsResponse.ok) throw new Error('Questions not found')
        const questionsResponseData = await questionsResponse.json()
        
        // Extract questions array from the response
        const questionsData = questionsResponseData.questions || questionsResponseData
        
        // Check if questionsData is an array
        if (!Array.isArray(questionsData)) {
          console.error('Questions data is not an array:', questionsData)
          console.error('Full response:', questionsResponseData)
          throw new Error('Invalid questions data format')
        }
        
        if (questionsData.length === 0) {
          throw new Error('No questions found for this quiz')
        }
        
        const transformedQuestions: MCQQuestion[] = questionsData.map((q: any) => ({
          id: q.id,
          question: q.question || q.text || 'Question not available',
          options: q.options || q.choices || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: q.correctAnswer ?? q.correctIndex ?? 0,
          explanation: q.explanation || q.solution || '',
          hint: q.hint || '',
          difficulty: (q.difficulty || 'INTERMEDIATE') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
        }))

        console.log('Transformed questions:', transformedQuestions)

        setCurrentSet({
          ...setData,
          questions: transformedQuestions,
          difficulty: (setData.difficulty || 'INTERMEDIATE') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
        })
        
      } catch (err) {
        console.error('Error fetching MCQ set:', err)
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack trace'
        })
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMCQSet()
  }, [setId])

  // Handle quiz completion
  const handleQuizComplete = (score: number, answers: (number | null)[]) => {
    const correctAnswers = answers.reduce((acc: number, answer, index) => {
      return answer === currentSet?.questions[index].correctAnswer ? acc + 1 : acc
    }, 0)

    const result: QuizResult = {
      score,
      correctAnswers,
      totalQuestions: currentSet?.questions.length || 0,
      answers
    }

    setQuizResult(result)
    setQuizCompleted(true)
  }

  // Handle quiz retry
  const handleRetryQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setQuizResult(null)
  }

  // Handle back to quizzes
  const handleBackToQuizzes = () => {
    router.push('/quiz')
  }

  if (isLoading || !setId || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
        {/* Home Link */}
        <div className="absolute top-4 left-4 z-50">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {!isInitialized ? 'Initializing...' : 'Loading Quiz...'}
              </h3>
              <p className="text-gray-600">
                {!isInitialized ? 'Setting up your quiz session' : 'Please wait while we prepare your questions'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !currentSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/40">
        {/* Home Link */}
        <div className="absolute top-4 left-4 z-50">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The requested quiz could not be loaded.'}</p>
            <Link href="/quiz">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
        {/* Home Link */}
        <div className="absolute top-4 left-4 z-50">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/quiz" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Quizzes
            </Link>
          </div>

          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {currentSet.category}
                  </Badge>
                  <CardTitle className="text-3xl font-bold">{currentSet.title}</CardTitle>
                </div>
              </div>
              <p className="text-blue-100 text-lg">{currentSet.description}</p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-2xl text-center">
                  <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-900 mb-1">{currentSet.questions.length}</div>
                  <div className="text-blue-700 font-medium">Questions</div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-2xl text-center">
                  <Timer className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  {(() => {
                    if (currentSet.timerMode === 'TOTAL_TIME') {
                      const totalTime = currentSet.totalTimeLimit || 30
                      return (
                        <>
                          <div className="text-2xl font-bold text-purple-900 mb-1">{totalTime}min</div>
                          <div className="text-purple-700 font-medium">Total Time</div>
                        </>
                      )
                    } else {
                      const timePerQuestion = currentSet.questionTimeLimit || 90
                      return (
                        <>
                          <div className="text-2xl font-bold text-purple-900 mb-1">{timePerQuestion}s</div>
                          <div className="text-purple-700 font-medium">Per Question</div>
                        </>
                      )
                    }
                  })()}
                </div>
                
                <div className="bg-green-50 p-6 rounded-2xl text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-900 mb-1">{currentSet.difficulty}</div>
                  <div className="text-green-700 font-medium">Difficulty</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setQuizStarted(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Quiz
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show quiz results after completion
  if (quizCompleted && quizResult && currentSet) {
    return (
      <QuizResults
        mcqSet={currentSet}
        result={quizResult}
        onRetryQuiz={handleRetryQuiz}
        onBackToQuizzes={handleBackToQuizzes}
      />
    )
  }

  // Show quiz interface when started
  if (quizStarted && currentSet) {
    return (
      <RefactoredQuizInterface
        mcqSet={currentSet}
        onComplete={handleQuizComplete}
        onExit={handleBackToQuizzes}
      />
    )
  }

  // This should never reach here as we handle all cases above
  return null
}
