import { useState, useCallback, useSyncExternalStore } from 'react'

const GUIDE_COMPLETED_KEY = 'sudoku_guide_completed'

function getGuideCompletedSnapshot(): boolean {
  return localStorage.getItem(GUIDE_COMPLETED_KEY) === 'true'
}

function getGuideCompletedServerSnapshot(): boolean {
  return false
}

function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function useFirstVisit() {
  const isGuideCompleted = useSyncExternalStore(
    subscribeToStorage,
    getGuideCompletedSnapshot,
    getGuideCompletedServerSnapshot
  )
  
  const [isFirstVisit, setIsFirstVisit] = useState(!isGuideCompleted)

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
    isLoading: false,
    markGuideCompleted,
    resetGuideStatus,
  }
}
