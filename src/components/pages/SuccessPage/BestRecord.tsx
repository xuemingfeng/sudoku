import { memo } from 'react'

type BestRecordProps = {
  bestRecord: number | null
  isNewRecord: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const BestRecord = memo(function BestRecord({
  bestRecord,
  isNewRecord,
}: BestRecordProps) {
  return (
    <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-center">
      {isNewRecord ? (
        <div className="flex items-center justify-center gap-2 text-amber-600">
          <span className="text-xl">🏆</span>
          <span className="font-bold text-lg">新纪录！</span>
        </div>
      ) : bestRecord !== null ? (
        <div className="flex items-center justify-center gap-2 text-amber-600">
          <span className="text-xl">🏆</span>
          <span className="font-semibold">最佳记录: {formatTime(bestRecord)}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-amber-600">
          <span className="text-xl">🏆</span>
          <span className="font-semibold">首次完成！</span>
        </div>
      )}
    </div>
  )
})
