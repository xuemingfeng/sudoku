import { useMemo } from 'react'
import type { SudokuCell } from '@/types/sudoku'
import type { Position } from '@/types/sudoku'
import { NumberButton } from './NumberButton'
import { DeleteButton } from './DeleteButton'
import { useRemainingCounts } from '@/hooks/useRemainingCounts'
import { useDisabledNumbers } from '@/hooks/useDisabledNumbers'

type NumberPadProps = {
  selectedCell: Position | null
  board: SudokuCell[][]
  onNumberClick: (number: number) => void
  onDeleteClick: () => void
  isGameComplete?: boolean
}

export function NumberPad({
  selectedCell,
  board,
  onNumberClick,
  onDeleteClick,
  isGameComplete = false,
}: NumberPadProps) {
  const remainingCounts = useRemainingCounts(board)
  const disabledNumbers = useDisabledNumbers(selectedCell, board, remainingCounts)

  const isDeleteDisabled = useMemo(() => {
    if (isGameComplete) return true
    if (!selectedCell) return true
    const cell = board[selectedCell.row][selectedCell.col]
    if (cell.isInitial) return true
    if (cell.value === null) return true
    return false
  }, [selectedCell, board, isGameComplete])

  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <NumberButton
          key={number}
          number={number}
          remainingCount={remainingCounts[number]}
          isDisabled={isGameComplete || disabledNumbers.has(number)}
          onClick={onNumberClick}
        />
      ))}
      <DeleteButton
        isDisabled={isDeleteDisabled}
        onClick={onDeleteClick}
      />
    </div>
  )
}
