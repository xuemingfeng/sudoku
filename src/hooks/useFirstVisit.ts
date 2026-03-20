import { useState, useEffect, useCallback } from 'react'

const GUIDE_COMPLETED_KEY = 'sudoku_guide_completed'

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const completed = localStorage.getItem(GUIDE_COMPLETED_KEY)
    setIsFirstVisit(!completed)
    setIsLoading(false)
  }, [])

  const markGuideCompleted = useCallback(() => {
    localStorage.setItem(GUIDE_COMPLETED_KEY, 'true')
    setIsFirstVisit(false)
  }, [])

  const resetGuideStatus = useCallback(() => {
    localStorage.removeItem(GUIDE_COMPLETED_KEY)
    setIsFirstVisit(true)
  }, [])

  return {
    isFirstVisit,
    isLoading,
    markGuideCompleted,
    resetGuideStatus,
  }
}
