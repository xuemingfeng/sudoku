import { memo } from 'react'

export const FailureHeader = memo(function FailureHeader() {
  return (
    <div className="text-center mb-8">
      <div className="text-6xl mb-4">😢</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">游戏结束了</h1>
      <p className="text-red-500 font-medium">错误次数已达上限</p>
    </div>
  )
})
