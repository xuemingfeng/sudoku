import type { SudokuCell, Position } from '@/types/sudoku'

type SudokuBoardProps = {
  board: SudokuCell[][]
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export function SudokuBoard({ board, selectedCell, onCellClick }: SudokuBoardProps) {
  return (
    <div className="flex justify-center">
      <div 
        className="grid grid-cols-9 gap-0 border-2 border-slate-600 bg-white" 
        style={{ width: '540px', height: '540px' }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-full h-full flex items-center justify-center text-3xl font-bold
                border border-slate-500
                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                  ? 'bg-blue-100' : ''}
                ${cell.isInitial ? 'bg-blue-50' : 'bg-white'}
                ${cell.isError ? 'text-red-500' : 'text-slate-800'}
                ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-slate-600' : ''}
                ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-slate-600' : ''}
                hover:bg-blue-50 transition-colors
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell.value || ''}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
