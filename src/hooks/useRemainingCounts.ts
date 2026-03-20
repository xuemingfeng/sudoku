import { useMemo } from 'react'
import type { SudokuCell } from '@/types/sudoku'

export function useRemainingCounts(board: SudokuCell[][]): Record<number, number> {
  return useMemo(() => {
    const counts: Record<number, number> = {
      1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9,
    }

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value
        if (value !== null && value >= 1 && value <= 9) {
          counts[value]--
        }
      }
    }

    return counts
  }, [board])
}
