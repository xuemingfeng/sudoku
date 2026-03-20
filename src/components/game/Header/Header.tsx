import { memo } from 'react'
import type { Difficulty } from '@/types/sudoku'

type HeaderProps = {
  title?: string
  timer: number
  errors: number
  maxErrors: number
  difficulty: Difficulty
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const Header = memo(function Header({
  title = '数独游戏',
  timer,
  errors,
  maxErrors,
  difficulty,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <i className="ri-game-line text-[32px] text-blue-600" />
        <span className="ml-3 text-[28px] font-bold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center">
          <i className="ri-time-line text-xl text-slate-500" />
          <span className="ml-2 text-xl font-semibold text-slate-700">{formatTime(timer)}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-close-circle-line text-xl text-red-500" />
          <span className="ml-2 text-xl font-semibold text-red-500">{errors}/{maxErrors}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-bar-chart-line text-xl text-purple-600" />
          <span className="ml-2 text-xl font-semibold text-purple-600">{difficultyLabels[difficulty]}</span>
        </div>
      </div>
    </div>
  )
})
