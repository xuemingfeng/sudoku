type NumberPadProps = {
  onNumberClick: (number: number) => void
  onDeleteClick: () => void
  remainingCounts: Record<number, number>
  disabledNumbers?: number[]
}

export function NumberPad({ 
  onNumberClick, 
  onDeleteClick, 
  remainingCounts,
  disabledNumbers = []
}: NumberPadProps) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          className={`
            w-12 h-12 flex flex-col items-center justify-center
            rounded-xl text-xl font-semibold
            transition-all duration-200
            ${disabledNumbers.includes(number) 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95'}
          `}
          onClick={() => onNumberClick(number)}
          disabled={disabledNumbers.includes(number)}
        >
          <span>{number}</span>
          <span className="text-xs text-slate-400">{remainingCounts[number] || 0}</span>
        </button>
      ))}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
        onClick={onDeleteClick}
      >
        <i className="ri-delete-back-line text-xl" />
      </button>
    </div>
  )
}
