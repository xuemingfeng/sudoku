import { useMemo } from 'react'
import { Cell } from './Cell'
import { getConflicts } from '@/algorithms/sudokuValidator'
import type { CellState } from '@/types/game'
import type { Position } from '@/types/sudoku'

type SudokuBoardProps = {
  board: CellState[][]
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export function SudokuBoard({ board, selectedCell, onCellClick }: SudokuBoardProps) {
  const conflicts = useMemo(() => {
    if (!selectedCell) return []
    const grid = board.map(row => row.map(cell => cell.value))
    return getConflicts(grid, selectedCell.row, selectedCell.col)
  }, [board, selectedCell])

  const conflictSet = useMemo(() => {
    return new Set(conflicts.map(c => `${c.row}-${c.col}`))
  }, [conflicts])

  const selectedValue = useMemo(() => {
    if (!selectedCell) return null
    return board[selectedCell.row][selectedCell.col].value
  }, [board, selectedCell])

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false
    const sameRow = selectedCell.row === row
    const sameCol = selectedCell.col === col
    const sameBox =
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3)
    return sameRow || sameCol || sameBox
  }

  const isSameNumber = (value: number | null): boolean => {
    if (!selectedCell || value === null) return false
    return selectedValue !== null && selectedValue === value
  }

  const isConflict = (row: number, col: number): boolean => {
    return conflictSet.has(`${row}-${col}`)
  }

  return (
    <div className="flex justify-center">
      <div
        className="grid grid-cols-9 border-2 border-slate-600 bg-white rounded-sm overflow-hidden board-container"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            const highlighted = isHighlighted(rowIndex, colIndex) && !isSelected
            const sameNumber = isSameNumber(cell.value)
            const hasConflict = isConflict(rowIndex, colIndex)

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                value={cell.value}
                isInitial={cell.isInitial}
                isError={cell.isError}
                isSelected={isSelected}
                isHighlighted={highlighted}
                isSameNumber={sameNumber}
                isConflict={hasConflict}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
