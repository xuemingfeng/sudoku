import { memo, useEffect, useCallback } from 'react'
import type { Difficulty } from '@/types/sudoku'

type DifficultyModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (difficulty: Difficulty) => void
}

const difficulties: Array<{ value: Difficulty; label: string; emoji: string; description: string }> = [
  { value: 'easy', label: '简单', emoji: '😊', description: '挖空 30-35 个，适合新手' },
  { value: 'medium', label: '中等', emoji: '🤔', description: '挖空 40-45 个，有一定挑战' },
  { value: 'hard', label: '困难', emoji: '😈', description: '挖空 50-55 个，极具挑战' },
]

export const DifficultyModal = memo(function DifficultyModal({
  isOpen,
  onClose,
  onSelect,
}: DifficultyModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="difficulty-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[90vw] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="difficulty-modal-title" className="text-xl font-bold text-slate-800">
            选择难度
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="关闭"
          >
            <i className="ri-close-line text-xl text-slate-500" />
          </button>
        </div>

        <div className="space-y-3">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              onClick={() => {
                onSelect(diff.value)
                onClose()
              }}
            >
              <span className="text-3xl">{diff.emoji}</span>
              <div>
                <div className="font-semibold text-slate-800">{diff.label}</div>
                <div className="text-sm text-slate-500">{diff.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
})
