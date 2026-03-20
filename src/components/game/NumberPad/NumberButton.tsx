import { memo } from 'react'

type NumberButtonProps = {
  number: number
  remainingCount: number
  isDisabled: boolean
  onClick: (number: number) => void
}

export const NumberButton = memo(function NumberButton({
  number,
  remainingCount,
  isDisabled,
  onClick,
}: NumberButtonProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onClick(number)
    }
  }

  return (
    <button
      className={`
        w-[60px] h-[60px] flex flex-col items-center justify-center
        rounded-xl transition-all duration-200
        ${isDisabled
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95'}
      `}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={`数字 ${number}，剩余 ${remainingCount} 个`}
      aria-disabled={isDisabled}
    >
      <span className="text-[28px] font-bold leading-none">{number}</span>
      <span className={`text-[14px] font-semibold mt-1 ${isDisabled ? 'text-slate-300' : 'text-slate-500'}`}>
        {remainingCount}
      </span>
    </button>
  )
})
