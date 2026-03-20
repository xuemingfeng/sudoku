import { memo } from 'react'

type ControlButtonProps = {
  icon: string
  label: string
  color: 'blue' | 'slate' | 'amber' | 'green' | 'red'
  onClick: () => void
  disabled?: boolean
}

const colorClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  slate: 'bg-slate-600 hover:bg-slate-700',
  amber: 'bg-amber-500 hover:bg-amber-600',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
}

export const ControlButton = memo(function ControlButton({
  icon,
  label,
  color,
  onClick,
  disabled = false,
}: ControlButtonProps) {
  return (
    <button
      className={`
        flex-1 flex items-center justify-center gap-2
        h-[51px] rounded-xl
        text-white font-semibold text-base
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : `${colorClasses[color]} active:scale-[0.98]`}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
    >
      <i className={`${icon} text-lg`} />
      <span>{label}</span>
    </button>
  )
})
