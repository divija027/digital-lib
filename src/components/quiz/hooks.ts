/**
 * Custom hooks for quiz functionality
 */

import { useState, useEffect, useCallback } from 'react'
import { MCQSet, QuizState, QuizProgress, QuizResult } from './types'

/**
 * Hook to manage quiz state and navigation
 */
export function useQuizState(mcqSet: MCQSet) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(mcqSet.questions.length).fill(null),
    answeredQuestions: new Array(mcqSet.questions.length).fill(false),
    showHint: false,
    showExplanation: false,
    isAnswered: false,
    selectedAnswer: null
  })

  /**
   * Handle answer selection for current question
   */
  const selectAnswer = useCallback((answerIndex: number) => {
    if (quizState.isAnswered) return

    const newSelectedAnswers = [...quizState.selectedAnswers]
    const newAnsweredQuestions = [...quizState.answeredQuestions]
    
    newSelectedAnswers[quizState.currentQuestion] = answerIndex
    newAnsweredQuestions[quizState.currentQuestion] = true

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      selectedAnswers: newSelectedAnswers,
      answeredQuestions: newAnsweredQuestions,
      isAnswered: true,
      showExplanation: true
    }))
  }, [quizState.currentQuestion, quizState.isAnswered])

  /**
   * Navigate to next question
   */
  const goToNext = useCallback(() => {
    if (quizState.currentQuestion < mcqSet.questions.length - 1) {
      const nextQuestion = quizState.currentQuestion + 1
      setQuizState(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        selectedAnswer: prev.selectedAnswers[nextQuestion],
        isAnswered: prev.answeredQuestions[nextQuestion],
        showHint: false,
        showExplanation: prev.answeredQuestions[nextQuestion]
      }))
      return false // Not finished
    }
    return true // Quiz finished
  }, [quizState.currentQuestion, mcqSet.questions.length])

  /**
   * Navigate to previous question
   */
  const goToPrevious = useCallback(() => {
    if (quizState.currentQuestion > 0) {
      const prevQuestion = quizState.currentQuestion - 1
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prevQuestion,
        selectedAnswer: prev.selectedAnswers[prevQuestion],
        isAnswered: prev.answeredQuestions[prevQuestion],
        showHint: false,
        showExplanation: prev.answeredQuestions[prevQuestion]
      }))
    }
  }, [quizState.currentQuestion])

  /**
   * Jump to specific question
   */
  const jumpToQuestion = useCallback((questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < mcqSet.questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: questionIndex,
        selectedAnswer: prev.selectedAnswers[questionIndex],
        isAnswered: prev.answeredQuestions[questionIndex],
        showHint: false,
        showExplanation: prev.answeredQuestions[questionIndex]
      }))
    }
  }, [mcqSet.questions.length])

  /**
   * Toggle hint visibility
   */
  const toggleHint = useCallback(() => {
    setQuizState(prev => ({ ...prev, showHint: !prev.showHint }))
  }, [])

  /**
   * Calculate quiz result
   */
  const calculateResult = useCallback((): QuizResult => {
    const correctAnswers = quizState.selectedAnswers.reduce((acc: number, answer, index) => {
      return answer === mcqSet.questions[index].correctAnswer ? acc + 1 : acc
    }, 0)
    
    const score = Math.round((correctAnswers / mcqSet.questions.length) * 100)
    
    return {
      score,
      correctAnswers,
      totalQuestions: mcqSet.questions.length,
      answers: quizState.selectedAnswers
    }
  }, [quizState.selectedAnswers, mcqSet.questions])

  return {
    quizState,
    selectAnswer,
    goToNext,
    goToPrevious,
    jumpToQuestion,
    toggleHint,
    calculateResult,
    currentQuestion: mcqSet.questions[quizState.currentQuestion]
  }
}

/**
 * Hook to manage quiz timer with support for both timer modes
 */
export function useQuizTimer(
  mcqSet: MCQSet,
  isAnswered: boolean,
  onTimeUp: () => void,
  currentQuestion?: number // Current question number to reset per-question timer
) {
  // Calculate initial time based on timer mode
  const getInitialTime = () => {
    if (mcqSet.timerMode === 'TOTAL_TIME') {
      // Return total time in seconds for the entire quiz
      return (mcqSet.totalTimeLimit || 30) * 60 // Convert minutes to seconds
    } else {
      // Return time per question in seconds
      return mcqSet.questionTimeLimit || 90 // Default 90 seconds per question
    }
  }

  const [timeLeft, setTimeLeft] = useState(getInitialTime())

  // Reset timer when question changes (only for PER_QUESTION mode)
  useEffect(() => {
    if (mcqSet.timerMode === 'PER_QUESTION') {
      setTimeLeft(mcqSet.questionTimeLimit || 90)
    }
  }, [currentQuestion, mcqSet.timerMode, mcqSet.questionTimeLimit])

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      onTimeUp()
    }
  }, [timeLeft, isAnswered, onTimeUp])

  return {
    timeLeft,
    timerMode: mcqSet.timerMode,
    isPerQuestionMode: mcqSet.timerMode === 'PER_QUESTION'
  }
}

/**
 * Hook to calculate quiz progress
 */
export function useQuizProgress(quizState: QuizState, totalQuestions: number): QuizProgress {
  const answeredCount = quizState.answeredQuestions.filter(Boolean).length
  const remainingCount = totalQuestions - answeredCount
  const progressPercentage = (answeredCount / totalQuestions) * 100

  return {
    currentQuestion: quizState.currentQuestion,
    totalQuestions,
    answeredCount,
    remainingCount,
    progressPercentage
  }
}