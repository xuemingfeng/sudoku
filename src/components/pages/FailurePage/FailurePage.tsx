import { memo } from 'react'
import type { Difficulty } from '@/types/sudoku'
import { FailureHeader } from './FailureHeader'
import { GameStats } from '../SuccessPage'
import { FailureButtons } from './FailureButtons'

type FailurePageProps = {
  stats: {
    time: number
    errors: number
    hints: number
    difficulty: Difficulty
  }
  maxErrors: number
  onRestart: () => void
  onSelectDifficulty: () => void
}

export const FailurePage = memo(function FailurePage({
  stats,
  maxErrors,
  onRestart,
  onSelectDifficulty,
}: FailurePageProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-main p-4">
      <div className="bg-white rounded-[32px] shadow-xl w-[500px] max-w-[95vw] animate-scale-in">
        <div className="p-8">
          <FailureHeader />
          <GameStats stats={stats} showMaxErrors maxErrors={maxErrors} />
          <FailureButtons onRestart={onRestart} onSelectDifficulty={onSelectDifficulty} />
        </div>
      </div>
    </div>
  )
})
