import { memo, useState, useCallback } from 'react'
import { StepIndicator } from './StepIndicator'
import { StepContent } from './StepContent'
import { GuideButtons } from './GuideButtons'

type GuidePageProps = {
  onComplete: () => void
  onSkip: () => void
}

const TOTAL_STEPS = 4

export const GuidePage = memo(function GuidePage({
  onComplete,
  onSkip,
}: GuidePageProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete()
    }
  }, [currentStep, onComplete])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleSkip = useCallback(() => {
    onSkip()
  }, [onSkip])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-main p-4" data-testid="guide-page">
      <div className="bg-white rounded-[32px] shadow-xl w-[800px] max-w-[95vw] max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-bold text-slate-800">🎮 数独游戏</h1>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="mt-8 min-h-[300px]">
            <StepContent step={currentStep} />
          </div>

          <GuideButtons
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>

        <div className="text-center pb-6">
          <button
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            跳过引导
          </button>
        </div>
      </div>
    </div>
  )
})
