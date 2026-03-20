import { memo, useEffect, useCallback } from 'react'
import type { GameState } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/constants/game'
import { formatTime } from '@/utils/format'

type ResumeGameModalProps = {
  isOpen: boolean
  savedState: GameState | null
  onResume: () => void
  onNewGame: () => void
}

export const ResumeGameModal = memo(function ResumeGameModal({
  isOpen,
  savedState,
  onResume,
  onNewGame,
}: ResumeGameModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onNewGame()
      }
    },
    [onNewGame]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !savedState) return null

  const difficultyLabel = DIFFICULTY_CONFIG[savedState.difficulty].label

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onNewGame}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      data-testid="resume-modal"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[90vw] p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
            <i className="ri-history-line text-xl text-blue-600" />
          </div>
          <h2 id="resume-modal-title" className="text-lg font-bold text-slate-800">
            发现未完成的游戏
          </h2>
        </div>

        <p className="text-slate-600 mb-4">
          检测到上次未完成的游戏，是否继续？
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <i className="ri-bar-chart-line text-slate-400" />
              <span className="text-slate-500">难度：</span>
              <span className="font-medium text-slate-700">{difficultyLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-slate-400" />
              <span className="text-slate-500">用时：</span>
              <span className="font-medium text-slate-700">{formatTime(savedState.timer)}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-close-circle-line text-slate-400" />
              <span className="text-slate-500">错误：</span>
              <span className="font-medium text-slate-700">{savedState.errors}/{savedState.maxErrors}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-lightbulb-line text-slate-400" />
              <span className="text-slate-500">提示：</span>
              <span className="font-medium text-slate-700">{savedState.hints}次</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onNewGame}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            开始新游戏
          </button>
          <button
            onClick={onResume}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  )
})
