import { memo } from 'react'

type DeleteButtonProps = {
  isDisabled: boolean
  onClick: () => void
}

export const DeleteButton = memo(function DeleteButton({
  isDisabled,
  onClick,
}: DeleteButtonProps) {
  return (
    <button
      className={`
        w-[60px] h-[60px] flex items-center justify-center
        rounded-xl transition-all duration-200
        ${isDisabled
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'}
      `}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label="删除"
      aria-disabled={isDisabled}
    >
      <i className="ri-delete-back-line text-[24px]" />
    </button>
  )
})
