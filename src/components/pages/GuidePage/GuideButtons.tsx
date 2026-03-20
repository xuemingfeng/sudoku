import { memo } from 'react'

type GuideButtonsProps = {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
}

export const GuideButtons = memo(function GuideButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
}: GuideButtonsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {!isFirstStep && (
        <button
          onClick={onPrev}
          className="px-6 h-12 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
        >
          上一步
        </button>
      )}
      <button
        onClick={onNext}
        className="px-8 h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        {isLastStep ? '开始游戏' : '下一步'}
      </button>
    </div>
  )
})
