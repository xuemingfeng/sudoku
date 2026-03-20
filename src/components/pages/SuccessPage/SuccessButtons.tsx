import { memo } from 'react'

type SuccessButtonsProps = {
  onPlayAgain: () => void
  onReturnHome: () => void
}

export const SuccessButtons = memo(function SuccessButtons({
  onPlayAgain,
  onReturnHome,
}: SuccessButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPlayAgain}
        className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        再来一局
      </button>
      <button
        onClick={onReturnHome}
        className="flex-1 h-12 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
      >
        返回主页
      </button>
    </div>
  )
})
