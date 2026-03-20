import { memo } from 'react'

type StepContentProps = {
  step: number
}

const guideSteps = [
  {
    title: '📋 数独规则',
    items: [
      { icon: '1️⃣', text: '数独是一个 9x9 的网格，分为 9 个 3x3 的宫格' },
      { icon: '2️⃣', text: '每行必须包含 1-9 的数字，且不重复' },
      { icon: '3️⃣', text: '每列必须包含 1-9 的数字，且不重复' },
      { icon: '4️⃣', text: '每个 3x3 宫格必须包含 1-9 的数字，且不重复' },
    ],
  },
  {
    title: '👆 操作方法',
    items: [
      { icon: '🖱️', text: '点击空白格子选中它' },
      { icon: '🔢', text: '点击底部数字按钮填入数字' },
      { icon: '⌫', text: '点击删除按钮清除已填数字' },
      { icon: '💡', text: '初始数字不可修改，显示为深色' },
    ],
  },
  {
    title: '✨ 高亮功能',
    items: [
      { icon: '🎨', text: '选中格子后，所在行、列、宫格会高亮显示' },
      { icon: '🔢', text: '相同数字会自动高亮，方便查看' },
      { icon: '❌', text: '填入错误数字时，冲突位置会红色高亮' },
      { icon: '👁️', text: '帮助您快速分析和推理' },
    ],
  },
  {
    title: '🎮 功能按钮',
    items: [
      { icon: '🆕', text: '新游戏：开始新的一局，可选择难度' },
      { icon: '🔄', text: '重置：清除所有填入，恢复初始状态' },
      { icon: '💡', text: '提示：自动填入一个正确答案' },
      { icon: '✅', text: '检查：验证当前填写是否正确' },
      { icon: '🚪', text: '结束游戏：结束当前游戏并保存进度' },
    ],
  },
]

export const StepContent = memo(function StepContent({ step }: StepContentProps) {
  const currentGuide = guideSteps[step]

  if (!currentGuide) return null

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
        {currentGuide.title}
      </h2>
      <div className="space-y-4">
        {currentGuide.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg text-slate-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
