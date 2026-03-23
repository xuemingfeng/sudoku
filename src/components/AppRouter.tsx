import { memo, useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@/context/NavigationContext'
import { GameProvider } from '@/context/GameContext'
import { useFirstVisit } from '@/hooks/useFirstVisit'
import { GuidePage, SuccessPage, FailurePage, GamePage } from '@/components/pages'
import type { GameResult } from '@/components/pages/GamePage'
import { getBestRecord, saveBestRecord } from '@/utils/storage'

export const AppRouter = memo(function AppRouter() {
  const { state, navigateTo, setTransitioning } = useNavigation()
  const { isFirstVisit, isLoading, markGuideCompleted } = useFirstVisit()
  const [gameResult, setGameResult] = useState<GameResult>(null)
  const [bestRecord, setBestRecordState] = useState<number | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (isFirstVisit) {
        navigateTo('guide')
      } else {
        navigateTo('game')
      }
    }
  }, [isLoading, isFirstVisit, navigateTo])

  useEffect(() => {
    if (state.isTransitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [state.isTransitioning, setTransitioning])

  const handleGuideComplete = useCallback(() => {
    markGuideCompleted()
    navigateTo('game')
  }, [markGuideCompleted, navigateTo])

  const handleGuideSkip = useCallback(() => {
    markGuideCompleted()
    navigateTo('game')
  }, [markGuideCompleted, navigateTo])

  const handleGameComplete = useCallback((result: GameResult) => {
    if (!result) return
    setGameResult(result)

    const currentBest = getBestRecord(result.difficulty)
    if (currentBest === null || result.time < currentBest) {
      saveBestRecord(result.difficulty, result.time)
      setBestRecordState(result.time)
      setIsNewRecord(true)
    } else {
      setBestRecordState(currentBest)
      setIsNewRecord(false)
    }

    navigateTo('success')
  }, [navigateTo])

  const handleGameFail = useCallback((result: GameResult) => {
    setGameResult(result)
    navigateTo('failure')
  }, [navigateTo])

  const handlePlayAgain = useCallback(() => {
    setGameResult(null)
    setIsNewRecord(false)
    navigateTo('game')
  }, [navigateTo])

  const handleReturnHome = useCallback(() => {
    setGameResult(null)
    setIsNewRecord(false)
    navigateTo('game')
  }, [navigateTo])

  const handleRestart = useCallback(() => {
    setGameResult(null)
    navigateTo('game')
  }, [navigateTo])

  const handleSelectDifficulty = useCallback(() => {
    setGameResult(null)
    navigateTo('game')
  }, [navigateTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    )
  }

  const pageClassName = state.isTransitioning
    ? 'animate-page-exit'
    : 'animate-page-enter'

  switch (state.currentRoute) {
    case 'guide':
      return (
        <div key="guide" className={pageClassName}>
          <GuidePage
            onComplete={handleGuideComplete}
            onSkip={handleGuideSkip}
          />
        </div>
      )

    case 'game':
      return (
        <GameProvider key="game">
          <div className={pageClassName}>
            <GamePage
              onGameComplete={handleGameComplete}
              onGameFail={handleGameFail}
            />
          </div>
        </GameProvider>
      )

    case 'success':
      return gameResult ? (
        <div key="success" className={pageClassName}>
          <SuccessPage
            stats={gameResult}
            bestRecord={bestRecord}
            isNewRecord={isNewRecord}
            onPlayAgain={handlePlayAgain}
            onReturnHome={handleReturnHome}
          />
        </div>
      ) : null

    case 'failure':
      return gameResult ? (
        <div key="failure" className={pageClassName}>
          <FailurePage
            stats={gameResult}
            maxErrors={3}
            onRestart={handleRestart}
            onSelectDifficulty={handleSelectDifficulty}
          />
        </div>
      ) : null

    default:
      return null
  }
})
