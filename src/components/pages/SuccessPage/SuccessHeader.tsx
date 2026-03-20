import { memo } from 'react'

export const SuccessHeader = memo(function SuccessHeader() {
  return (
    <div className="text-center mb-8">
      <div className="text-6xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-2xl font-bold text-slate-800">恭喜你完成了！</h1>
    </div>
  )
})
