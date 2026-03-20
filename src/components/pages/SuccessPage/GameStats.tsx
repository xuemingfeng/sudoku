import { memo } from 'react'
import type { Difficulty } from '@/types/sudoku'

type GameStatsProps = {
  stats: {
    time: number
    errors: number
    hints: number
    difficulty: Difficulty
  }
  showMaxErrors?: boolean
  maxErrors?: number
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

export const GameStats = memo(function GameStats({
  stats,
  showMaxErrors = false,
  maxErrors = 3,
}: GameStatsProps) {
  const statItems = [
    { icon: '⏱️', label: '用时', value: formatTime(stats.time) },
    { icon: '❌', label: '错误', value: showMaxErrors ? `${stats.errors}/${maxErrors}` : `${stats.errors} 次` },
    { icon: '💡', label: '提示', value: `${stats.hints} 次` },
    { icon: '📈', label: '难度', value: difficultyLabels[stats.difficulty] },
  ]

  return (
    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>游戏统计</span>
      </h2>
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span className="font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
