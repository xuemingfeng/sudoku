import { memo } from 'react'

type StepIndicatorProps = {
  currentStep: number
  totalSteps: number
}

export const StepIndicator = memo(function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentStep
              ? 'bg-blue-600 scale-110'
              : index < currentStep
              ? 'bg-blue-400'
              : 'bg-slate-300'
          }`}
          aria-label={index === currentStep ? `当前步骤 ${index + 1}` : `步骤 ${index + 1}`}
        />
      ))}
    </div>
  )
})
