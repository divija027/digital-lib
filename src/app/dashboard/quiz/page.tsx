'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Lock,
  CheckCircle,
  Timer,
  Trophy,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Home
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data for the quiz - Enhanced for company assessments
const mockQuizData = {
  day1: [
    {
      id: 1,
      text: "What is the time complexity of binary search in a sorted array?",
      choices: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctIndex: 1,
      hint: "Think about how the search space is divided in each iteration.",
      solution: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      company: "Google",
      difficulty: "Medium",
      category: "Technical Aptitude"
    },
    {
      id: 2,
      text: "Which data structure uses LIFO (Last In, First Out) principle?",
      choices: ["Queue", "Stack", "Array", "Linked List"],
      correctIndex: 1,
      hint: "Think about how items are added and removed in this structure.",
      solution: "Stack follows LIFO principle where the last element added is the first one to be removed.",
      company: "Microsoft",
      difficulty: "Easy",
      category: "Technical Aptitude"
    },
    {
      id: 3,
      text: "What is the output of 'console.log(typeof null)' in JavaScript?",
      choices: ["null", "undefined", "object", "boolean"],
      correctIndex: 2,
      hint: "This is a well-known quirk in JavaScript.",
      solution: "In JavaScript, typeof null returns 'object' due to a legacy bug that was never fixed for backward compatibility.",
      company: "Amazon",
      difficulty: "Medium",
      category: "Technical Aptitude"
    },
    {
      id: 4,
      text: "A train 100m long crosses a platform 200m long in 20 seconds. What is the speed of the train?",
      choices: ["15 m/s", "54 km/hr", "Both A and B", "20 m/s"],
      correctIndex: 2,
      hint: "Calculate total distance and use speed = distance/time formula.",
      solution: "Total distance = 100m + 200m = 300m. Speed = 300m/20s = 15 m/s = 54 km/hr.",
      company: "TCS",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 5,
      text: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
      choices: ["42", "40", "38", "44"],
      correctIndex: 0,
      hint: "Look at the differences between consecutive numbers.",
      solution: "Differences: 4, 6, 8, 10, ... Next difference is 12. So 30 + 12 = 42.",
      company: "Infosys",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 6,
      text: "Choose the word that is most similar to 'EXACERBATE':",
      choices: ["Improve", "Worsen", "Maintain", "Ignore"],
      correctIndex: 1,
      hint: "Think about making something worse or more severe.",
      solution: "Exacerbate means to make a problem or situation worse, so 'Worsen' is the closest synonym.",
      company: "Wipro",
      difficulty: "Medium",
      category: "Verbal Reasoning"
    },
    {
      id: 7,
      text: "If CODING is written as DPEJOH, how is FIXING written?",
      choices: ["GJYJOH", "GKYIOI", "GKYJOH", "GJZIOH"],
      correctIndex: 0,
      hint: "Each letter is shifted by one position in the alphabet.",
      solution: "Each letter is shifted by +1: F→G, I→J, X→Y, I→J, N→O, G→H. So FIXING becomes GJYJOH.",
      company: "Accenture",
      difficulty: "Easy",
      category: "Verbal Reasoning"
    },
    {
      id: 8,
      text: "What is the minimum number of colors needed to color a planar graph?",
      choices: ["2", "3", "4", "5"],
      correctIndex: 2,
      hint: "This is a famous theorem in graph theory.",
      solution: "According to the Four Color Theorem, any planar graph can be colored with at most 4 colors.",
      company: "IBM",
      difficulty: "Hard",
      category: "Technical Aptitude"
    },
    {
      id: 9,
      text: "A shopkeeper marks his goods 40% above cost price but gives a discount of 20%. His profit percentage is:",
      choices: ["10%", "12%", "15%", "20%"],
      correctIndex: 1,
      hint: "Calculate marked price first, then selling price after discount.",
      solution: "Let CP = 100. MP = 140. SP = 140 - (20% of 140) = 140 - 28 = 112. Profit% = 12%.",
      company: "Cognizant",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 10,
      text: "Which sorting algorithm has the best worst-case time complexity?",
      choices: ["Quick Sort", "Bubble Sort", "Merge Sort", "Selection Sort"],
      correctIndex: 2,
      hint: "Think about algorithms that consistently perform well regardless of input.",
      solution: "Merge Sort has O(n log n) worst-case time complexity, making it reliable for all inputs.",
      company: "Google",
      difficulty: "Medium",
      category: "Technical Aptitude"
    },
    {
      id: 11,
      text: "In the following sentence, identify the error: 'Neither John nor his friends was present at the meeting.'",
      choices: ["Neither", "nor", "was", "No error"],
      correctIndex: 2,
      hint: "Check subject-verb agreement with 'neither...nor' construction.",
      solution: "With 'neither...nor', the verb agrees with the nearer subject. Since 'friends' is plural, it should be 'were' not 'was'.",
      company: "HCL",
      difficulty: "Medium",
      category: "Verbal Reasoning"
    },
    {
      id: 12,
      text: "What is the space complexity of quicksort in the worst case?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctIndex: 2,
      hint: "Consider the recursion stack depth in worst case.",
      solution: "In worst case, quicksort's recursion depth can be O(n), leading to O(n) space complexity.",
      company: "Facebook",
      difficulty: "Hard",
      category: "Technical Aptitude"
    },
    {
      id: 13,
      text: "If a clock shows 3:15, what is the angle between the hour and minute hands?",
      choices: ["0°", "7.5°", "15°", "22.5°"],
      correctIndex: 1,
      hint: "Calculate positions of both hands and find the difference.",
      solution: "At 3:15, minute hand is at 90°, hour hand is at 97.5° (3×30 + 15×0.5). Angle = 7.5°.",
      company: "Oracle",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 14,
      text: "Complete the analogy: Thermometer : Temperature :: Barometer : ?",
      choices: ["Pressure", "Humidity", "Wind", "Rain"],
      correctIndex: 0,
      hint: "Think about what each instrument measures.",
      solution: "A thermometer measures temperature, similarly a barometer measures atmospheric pressure.",
      company: "Capgemini",
      difficulty: "Easy",
      category: "Verbal Reasoning"
    },
    {
      id: 15,
      text: "What is the result of (XOR operation) 1010 XOR 1100 in binary?",
      choices: ["0110", "1110", "0010", "1010"],
      correctIndex: 0,
      hint: "XOR returns 1 when bits are different, 0 when same.",
      solution: "1010 XOR 1100 = 0110 (bit by bit: 1⊕1=0, 0⊕1=1, 1⊕0=1, 0⊕0=0).",
      company: "Intel",
      difficulty: "Medium",
      category: "Technical Aptitude"
    },
    {
      id: 16,
      text: "A sum of money becomes 3 times in 10 years at simple interest. In how many years will it become 5 times?",
      choices: ["15 years", "20 years", "25 years", "30 years"],
      correctIndex: 1,
      hint: "Find the rate first, then calculate time for 5 times.",
      solution: "If amount becomes 3 times in 10 years, interest rate = 20% per annum. For 5 times, it takes 20 years.",
      company: "HSBC",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 17,
      text: "Choose the correctly punctuated sentence:",
      choices: [
        "The manager said, 'The project is completed.'",
        "The manager said, \"The project is completed\"",
        "The manager said 'The project is completed'.",
        "The manager said: The project is completed."
      ],
      correctIndex: 0,
      hint: "Check proper use of quotation marks and punctuation.",
      solution: "Option A correctly uses quotation marks and places the period inside the quotes.",
      company: "Deloitte",
      difficulty: "Easy",
      category: "Verbal Reasoning"
    },
    {
      id: 18,
      text: "Which design pattern ensures only one instance of a class exists?",
      choices: ["Factory", "Observer", "Singleton", "Strategy"],
      correctIndex: 2,
      hint: "The pattern name suggests there's only one of something.",
      solution: "Singleton pattern ensures a class has only one instance and provides global access to it.",
      company: "Adobe",
      difficulty: "Easy",
      category: "Technical Aptitude"
    },
    {
      id: 19,
      text: "Find the wrong number in the series: 1, 4, 9, 16, 20, 36",
      choices: ["4", "9", "20", "36"],
      correctIndex: 2,
      hint: "This should be a series of perfect squares.",
      solution: "The series should be perfect squares: 1², 2², 3², 4², 5², 6². So 20 should be 25.",
      company: "Samsung",
      difficulty: "Medium",
      category: "Quantitative Reasoning"
    },
    {
      id: 20,
      text: "What does 'pragmatic' mean?",
      choices: ["Idealistic", "Practical", "Theoretical", "Pessimistic"],
      correctIndex: 1,
      hint: "Think about being realistic and practical in approach.",
      solution: "Pragmatic means dealing with things in a practical rather than idealistic way.",
      company: "L&T",
      difficulty: "Easy",
      category: "Verbal Reasoning"
    }
  ],
  day2: [
    {
      id: 21,
      text: "What is the difference between '==' and '===' in JavaScript?",
      choices: ["No difference", "=== checks type and value, == only checks value", "== is faster", "=== is deprecated"],
      correctIndex: 1,
      hint: "One is more strict about data types.",
      solution: "=== (strict equality) checks both type and value, while == (loose equality) only checks value after type coercion."
    },
    {
      id: 22,
      text: "Which CSS property is used to change text color?",
      choices: ["color", "text-color", "font-color", "text-style"],
      correctIndex: 0,
      hint: "It's a simple, one-word property.",
      solution: "The 'color' property in CSS is used to change the color of text."
    },
    {
      id: 23,
      text: "What does DOM stand for?",
      choices: ["Document Object Model", "Data Object Management", "Dynamic Object Model", "Document Oriented Model"],
      correctIndex: 0,
      hint: "It represents the structure of web documents.",
      solution: "DOM stands for Document Object Model, representing the structure of HTML/XML documents as objects."
    },
    {
      id: 24,
      text: "Which method is used to add event listeners in JavaScript?",
      choices: ["addEvent()", "addEventListener()", "attachEvent()", "on()"],
      correctIndex: 1,
      hint: "It's the standard method for modern browsers.",
      solution: "addEventListener() is the standard method to attach event handlers to elements."
    },
    {
      id: 25,
      text: "What is the purpose of the 'key' prop in React?",
      choices: ["Security", "Styling", "Help React identify elements", "Data binding"],
      correctIndex: 2,
      hint: "It helps React optimize rendering performance.",
      solution: "The 'key' prop helps React identify which items have changed, are added, or removed for efficient re-rendering."
    },
    {
      id: 26,
      text: "Which HTTP status code indicates 'Not Found'?",
      choices: ["400", "401", "404", "500"],
      correctIndex: 2,
      hint: "It's a very common error code you've probably seen.",
      solution: "HTTP status code 404 indicates that the requested resource was not found on the server."
    },
    {
      id: 27,
      text: "What is the difference between let and var in JavaScript?",
      choices: ["No difference", "let has block scope, var has function scope", "var is newer", "let is faster"],
      correctIndex: 1,
      hint: "Think about where these variables can be accessed.",
      solution: "let has block scope (only accessible within the block), while var has function scope."
    },
    {
      id: 28,
      text: "Which CSS display property removes an element from the document flow?",
      choices: ["block", "inline", "none", "hidden"],
      correctIndex: 2,
      hint: "This property makes the element completely disappear.",
      solution: "display: none removes the element from the document flow entirely, making it invisible and taking up no space."
    },
    {
      id: 29,
      text: "What is npm?",
      choices: ["Node Package Manager", "New Programming Method", "Network Protocol Manager", "Node Process Manager"],
      correctIndex: 0,
      hint: "It's related to Node.js and managing code packages.",
      solution: "npm stands for Node Package Manager, used to install and manage JavaScript packages."
    },
    {
      id: 30,
      text: "Which array method creates a new array with all elements that pass a test?",
      choices: ["map()", "filter()", "reduce()", "forEach()"],
      correctIndex: 1,
      hint: "The name suggests it removes unwanted elements.",
      solution: "filter() creates a new array with elements that pass a test implemented by a provided function."
    },
    {
      id: 31,
      text: "What is the purpose of semantic HTML?",
      choices: ["Better styling", "Faster loading", "Better accessibility and SEO", "Smaller file size"],
      correctIndex: 2,
      hint: "It's about meaning and structure for both humans and machines.",
      solution: "Semantic HTML provides meaning to web content, improving accessibility for screen readers and SEO for search engines."
    },
    {
      id: 32,
      text: "Which CSS unit is relative to the viewport width?",
      choices: ["px", "em", "vw", "rem"],
      correctIndex: 2,
      hint: "The letters in the unit name give it away.",
      solution: "vw (viewport width) is relative to 1% of the viewport's width."
    },
    {
      id: 33,
      text: "What is a closure in JavaScript?",
      choices: ["A function that closes", "A function with access to outer scope", "A closed loop", "A conditional statement"],
      correctIndex: 1,
      hint: "It's about functions and their access to variables.",
      solution: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns."
    },
    {
      id: 34,
      text: "Which command is used to initialize a new Git repository?",
      choices: ["git start", "git init", "git create", "git new"],
      correctIndex: 1,
      hint: "It's short for 'initialize'.",
      solution: "git init initializes a new Git repository in the current directory."
    },
    {
      id: 35,
      text: "What does CSS Box Model consist of?",
      choices: ["Content, padding, border, margin", "Header, body, footer", "HTML, CSS, JavaScript", "Width, height, color"],
      correctIndex: 0,
      hint: "Think about the layers around an element from inside out.",
      solution: "CSS Box Model consists of content, padding, border, and margin, from innermost to outermost."
    },
    {
      id: 36,
      text: "Which JavaScript method converts a string to a number?",
      choices: ["parseInt()", "toString()", "valueOf()", "Number()"],
      correctIndex: 0,
      hint: "The method name suggests parsing integers.",
      solution: "parseInt() parses a string and returns an integer (though Number() also works for conversion)."
    },
    {
      id: 37,
      text: "What is the purpose of the alt attribute in img tags?",
      choices: ["Alternative styling", "Alternative text for accessibility", "Alternative source", "Alternative color"],
      correctIndex: 1,
      hint: "It's important for users who can't see images.",
      solution: "The alt attribute provides alternative text for images, crucial for accessibility and screen readers."
    },
    {
      id: 38,
      text: "Which CSS property controls the stacking order of elements?",
      choices: ["stack", "layer", "z-index", "order"],
      correctIndex: 2,
      hint: "Think about the z-axis in 3D space.",
      solution: "z-index controls the stacking order of positioned elements along the z-axis."
    },
    {
      id: 39,
      text: "What is the difference between null and undefined in JavaScript?",
      choices: ["No difference", "null is assigned, undefined is default", "undefined is newer", "null is faster"],
      correctIndex: 1,
      hint: "One is intentionally set by developers, the other is automatic.",
      solution: "null is an intentionally assigned value representing 'no value', while undefined means a variable has been declared but not assigned."
    },
    {
      id: 40,
      text: "Which CSS property makes text bold?",
      choices: ["text-weight", "font-weight", "text-bold", "font-style"],
      correctIndex: 1,
      hint: "It's about the weight of the font.",
      solution: "font-weight property controls the thickness/boldness of text, with values like normal, bold, or numeric values."
    }
  ]
}

const mockLeaderboard = [
  { name: "Alice Johnson", score: 1840, isYou: false },
  { name: "You", score: 1620, isYou: true },
  { name: "Bob Smith", score: 1580, isYou: false },
  { name: "Carol Davis", score: 1420, isYou: false },
  { name: "David Wilson", score: 1380, isYou: false },
  { name: "Emma Brown", score: 1200, isYou: false },
  { name: "Frank Miller", score: 1150, isYou: false },
  { name: "Grace Lee", score: 1100, isYou: false }
]

export default function QuizPage() {
  const router = useRouter()
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(90)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [dayScores, setDayScores] = useState<{[key: number]: number}>({})
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)

  const currentQuestions = currentDay === 1 ? mockQuizData.day1 : mockQuizData.day2
  const currentQuestion = currentQuestions[currentQuestionIndex]
  const totalQuestions = currentQuestions.length

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !isAnswerLocked) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showFeedback) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeLeft, showFeedback, isAnswerLocked])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(90)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setShowHint(false)
    setShowSolution(false)
    setQuestionStartTime(Date.now())
    setIsAnswerLocked(false)
  }, [currentQuestionIndex, currentDay])

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerLocked && !showFeedback) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleSubmit = useCallback(() => {
    if (isAnswerLocked || showFeedback) return

    const correct = selectedAnswer === currentQuestion.correctIndex
    setIsCorrect(correct)
    setShowFeedback(true)
    setIsAnswerLocked(true)

    // Calculate score based on time taken and correctness
    const timeTaken = (Date.now() - questionStartTime) / 1000
    const timeBonus = Math.max(0, 90 - timeTaken)
    const questionScore = correct ? Math.round(100 + timeBonus) : 0

    // Update day score
    setDayScores(prev => ({
      ...prev,
      [currentDay]: (prev[currentDay] || 0) + questionScore
    }))

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Day completed
        setCompletedDays(prev => [...prev, currentDay])
        // Reset to first question for next access
        setCurrentQuestionIndex(0)
      }
    }, 2000)
  }, [selectedAnswer, currentQuestion.correctIndex, currentQuestionIndex, totalQuestions, currentDay, questionStartTime, isAnswerLocked, showFeedback])

  const isDayUnlocked = (day: number) => {
    if (day === 1) return true
    return completedDays.includes(day - 1)
  }

  const isDayCompleted = (day: number) => {
    return completedDays.includes(day)
  }

  const handleDaySelect = (day: number) => {
    if (isDayUnlocked(day)) {
      setCurrentDay(day)
      setCurrentQuestionIndex(0)
    }
  }

  const progressPercentage = ((90 - timeLeft) / 90) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Daily Programming Quiz</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              Your Score: {Object.values(dayScores).reduce((a, b) => a + b, 0)} pts
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Mobile Navigation */}
        <div className="lg:hidden mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                Days
              </h3>
              <div className="space-y-2">
                {[1, 2].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    disabled={!isDayUnlocked(day)}
                    className={`w-full p-2 rounded-lg border text-sm transition-all ${
                      currentDay === day
                        ? 'border-blue-500 bg-blue-50'
                        : isDayUnlocked(day)
                        ? 'border-gray-200 bg-white hover:border-blue-300'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isDayCompleted(day) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : isDayUnlocked(day) ? (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">{day}</span>
                        </div>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={isDayUnlocked(day) ? 'text-gray-900' : 'text-gray-400'}>
                        Day {day}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Medal className="w-4 h-4 text-yellow-500" />
                Top 3
              </h3>
              <div className="space-y-2">
                {mockLeaderboard.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`flex-1 ${user.isYou ? 'font-semibold text-blue-600' : ''}`}>
                      {user.name}
                    </span>
                    <span className="font-mono text-xs">{user.score}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Day Tiles Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  Days
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    disabled={!isDayUnlocked(day)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      currentDay === day
                        ? 'border-blue-500 bg-blue-50'
                        : isDayUnlocked(day)
                        ? 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isDayCompleted(day) ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : isDayUnlocked(day) ? (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{day}</span>
                          </div>
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                        <div className="text-left">
                          <div className={`font-semibold ${
                            isDayUnlocked(day) ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            Day {day}
                          </div>
                          <div className={`text-sm ${
                            isDayUnlocked(day) ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            20 Questions
                          </div>
                        </div>
                      </div>
                      {dayScores[day] && (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-600">
                            {dayScores[day]} pts
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <span className={`font-mono text-lg ${
                      timeLeft <= 10 ? 'text-red-500' : 'text-gray-900'
                    }`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-gray-900">
                  {currentQuestion.text}
                </div>

                <div className="space-y-3">
                  {currentQuestion.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswerLocked}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showFeedback
                          ? index === currentQuestion.correctIndex
                            ? 'border-green-500 bg-green-50'
                            : index === selectedAnswer && index !== currentQuestion.correctIndex
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                          : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showFeedback
                            ? index === currentQuestion.correctIndex
                              ? 'border-green-500 bg-green-500'
                              : index === selectedAnswer && index !== currentQuestion.correctIndex
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {((showFeedback && index === currentQuestion.correctIndex) || 
                            (selectedAnswer === index && (!showFeedback || index === currentQuestion.correctIndex))) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{choice}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {!showFeedback && !isAnswerLocked && (
                  <Button 
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                )}

                {showFeedback && (
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className={`font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                    </div>
                    <div className={`text-sm mt-1 ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrect 
                        ? `Great job! Moving to next question...`
                        : `The correct answer was: ${currentQuestion.choices[currentQuestion.correctIndex]}`
                      }
                    </div>
                  </div>
                )}

                {/* Hint and Solution Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2"
                  >
                    {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Hint
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-2"
                  >
                    {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Solution
                  </Button>
                </div>

                {/* Hint Box */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  showHint ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-semibold text-yellow-800 mb-2">💡 Hint:</div>
                    <div className="text-yellow-700">{currentQuestion.hint}</div>
                  </div>
                </div>

                {/* Solution Box */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  showSolution ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-semibold text-blue-800 mb-2">📖 Solution:</div>
                    <div className="text-blue-700">{currentQuestion.solution}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLeaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isYou ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? <Trophy className="w-4 h-4" /> :
                          index === 1 ? <Medal className="w-4 h-4" /> :
                          <Award className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${user.isYou ? 'text-blue-900' : 'text-gray-900'}`}>
                          {user.name}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${user.isYou ? 'text-blue-600' : 'text-gray-600'}`}>
                      {user.score}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
