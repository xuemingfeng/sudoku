import { useMemo } from 'react'
import type { SudokuCell } from '@/types/sudoku'
import type { Position } from '@/types/sudoku'
import { getValidNumbers } from '@/algorithms/sudokuValidator'

export function useDisabledNumbers(
  selectedCell: Position | null,
  board: SudokuCell[][],
  remainingCounts: Record<number, number>
): Set<number> {
  return useMemo(() => {
    const disabledNumbers = new Set<number>()

    for (let num = 1; num <= 9; num++) {
      if (remainingCounts[num] === 0) {
        disabledNumbers.add(num)
      }
    }

    if (selectedCell) {
      const { row, col } = selectedCell
      const cell = board[row][col]

      if (cell.isInitial) {
        for (let num = 1; num <= 9; num++) {
          disabledNumbers.add(num)
        }
        return disabledNumbers
      }

      const grid = board.map(r => r.map(c => c.value))
      const validNumbers = getValidNumbers(grid, row, col)

      for (let num = 1; num <= 9; num++) {
        if (!validNumbers.includes(num)) {
          disabledNumbers.add(num)
        }
      }
    }

    return disabledNumbers
  }, [selectedCell, board, remainingCounts])
}
