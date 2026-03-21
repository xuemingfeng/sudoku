import { memo } from 'react'
import type { Difficulty } from '@/types/sudoku'
import { SuccessHeader } from './SuccessHeader'
import { GameStats } from './GameStats'
import { BestRecord } from './BestRecord'
import { SuccessButtons } from './SuccessButtons'

type SuccessPageProps = {
  stats: {
    time: number
    errors: number
    hints: number
    difficulty: Difficulty
  }
  bestRecord: number | null
  isNewRecord: boolean
  onPlayAgain: () => void
  onReturnHome: () => void
}

export const SuccessPage = memo(function SuccessPage({
  stats,
  bestRecord,
  isNewRecord,
  onPlayAgain,
  onReturnHome,
}: SuccessPageProps) {
  return (
    <div className="inset-0 z-50 flex items-center justify-center bg-gradient-main p-4">
      <div className="bg-white rounded-[32px] shadow-xl w-[500px] max-w-[95vw] animate-scale-in">
        <div className="p-8">
          <SuccessHeader />
          <GameStats stats={stats} />
          <BestRecord bestRecord={bestRecord} isNewRecord={isNewRecord} />
          <SuccessButtons onPlayAgain={onPlayAgain} onReturnHome={onReturnHome} />
        </div>
      </div>
    </div>
  )
})
