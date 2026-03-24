import { memo } from 'react'

type FailureButtonsProps = {
  onRestart: () => void
  onSelectDifficulty: () => void
}

export const FailureButtons = memo(function FailureButtons({
  onRestart,
  onSelectDifficulty,
}: FailureButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onRestart}
        className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        重玩本局
      </button>
      <button
        onClick={onSelectDifficulty}
        className="flex-1 h-12 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
      >
        开始游戏
      </button>
    </div>
  )
})
