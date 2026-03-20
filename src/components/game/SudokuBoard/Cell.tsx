import { memo } from 'react'

type CellProps = {
  row: number
  col: number
  value: number | null
  isInitial: boolean
  isError: boolean
  isSelected: boolean
  isHighlighted: boolean
  isSameNumber: boolean
  isConflict: boolean
  onClick: () => void
}

function CellComponent({
  row,
  col,
  value,
  isInitial,
  isError,
  isSelected,
  isHighlighted,
  isSameNumber,
  isConflict,
  onClick,
}: CellProps) {
  const getBackgroundClass = () => {
    if (isConflict) return 'bg-red-100'
    if (isSelected) return 'bg-blue-200'
    if (isSameNumber) return 'bg-blue-100'
    if (isHighlighted) return 'bg-slate-100'
    if (isInitial) return 'bg-blue-50'
    return 'bg-white'
  }

  const getBorderClass = () => {
    const classes: string[] = []
    
    if (col % 3 === 2 && col !== 8) {
      classes.push('border-r-2', 'border-r-slate-600')
    }
    if (row % 3 === 2 && row !== 8) {
      classes.push('border-b-2', 'border-b-slate-600')
    }
    
    return classes.join(' ')
  }

  const getTextClass = () => {
    if (isError || isConflict) return 'text-red-500'
    return 'text-slate-800'
  }

  return (
    <button
      type="button"
      className={`
        w-[60px] h-[60px]
        flex items-center justify-center
        text-[28px] font-bold
        border border-slate-500
        ${getBackgroundClass()}
        ${getBorderClass()}
        ${getTextClass()}
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset
        hover:brightness-95
        active:brightness-90
      `}
      onClick={onClick}
      aria-label={`单元格 ${row + 1}行 ${col + 1}列${value ? `，值为 ${value}` : '，空'}`}
      data-row={row}
      data-col={col}
      data-value={value ?? ''}
      data-initial={isInitial}
    >
      {value ?? ''}
    </button>
  )
}

export const Cell = memo(CellComponent)
