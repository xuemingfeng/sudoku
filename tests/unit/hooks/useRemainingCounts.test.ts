import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRemainingCounts } from '@/hooks/useRemainingCounts'
import type { SudokuCell } from '@/types/sudoku'

function createEmptyBoard(): SudokuCell[][] {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      row: 0,
      col: 0,
      value: null,
      isInitial: false,
      isError: false,
    }))
  )
}

function createBoardWithValues(values: Array<{ row: number; col: number; value: number }>): SudokuCell[][] {
  const board = createEmptyBoard()
  values.forEach(({ row, col, value }) => {
    board[row][col] = {
      row,
      col,
      value,
      isInitial: true,
      isError: false,
    }
  })
  return board
}

describe('useRemainingCounts', () => {
  it('should return 9 for all numbers on empty board', () => {
    const board = createEmptyBoard()
    const { result } = renderHook(() => useRemainingCounts(board))
    
    for (let num = 1; num <= 9; num++) {
      expect(result.current[num]).toBe(9)
    }
  })

  it('should decrement count when number is placed', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
      { row: 0, col: 1, value: 5 },
    ])
    const { result } = renderHook(() => useRemainingCounts(board))
    
    expect(result.current[5]).toBe(7)
    expect(result.current[1]).toBe(9)
  })

  it('should return 0 when all 9 of a number are placed', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 3 },
      { row: 0, col: 1, value: 3 },
      { row: 0, col: 2, value: 3 },
      { row: 1, col: 0, value: 3 },
      { row: 1, col: 1, value: 3 },
      { row: 1, col: 2, value: 3 },
      { row: 2, col: 0, value: 3 },
      { row: 2, col: 1, value: 3 },
      { row: 2, col: 2, value: 3 },
    ])
    const { result } = renderHook(() => useRemainingCounts(board))
    
    expect(result.current[3]).toBe(0)
  })

  it('should memoize results', () => {
    const board = createEmptyBoard()
    const { result, rerender } = renderHook(() => useRemainingCounts(board))
    
    const firstResult = result.current
    
    rerender()
    
    expect(result.current).toBe(firstResult)
  })

  it('should update when board changes', () => {
    const board1 = createEmptyBoard()
    const { result, rerender } = renderHook(
      ({ board }) => useRemainingCounts(board),
      { initialProps: { board: board1 } }
    )
    
    expect(result.current[5]).toBe(9)
    
    const board2 = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
    ])
    
    rerender({ board: board2 })
    
    expect(result.current[5]).toBe(8)
  })

  it('should handle mixed values', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 1 },
      { row: 0, col: 1, value: 2 },
      { row: 0, col: 2, value: 3 },
      { row: 1, col: 0, value: 1 },
      { row: 1, col: 1, value: 2 },
      { row: 1, col: 2, value: 3 },
    ])
    const { result } = renderHook(() => useRemainingCounts(board))
    
    expect(result.current[1]).toBe(7)
    expect(result.current[2]).toBe(7)
    expect(result.current[3]).toBe(7)
    expect(result.current[4]).toBe(9)
    expect(result.current[5]).toBe(9)
  })

  it('should ignore null values', () => {
    const board = createEmptyBoard()
    board[0][0] = {
      row: 0,
      col: 0,
      value: null,
      isInitial: false,
      isError: false,
    }
    
    const { result } = renderHook(() => useRemainingCounts(board))
    
    expect(result.current[1]).toBe(9)
  })

  it('should handle full board', () => {
    const board: SudokuCell[][] = []
    let value = 1
    for (let row = 0; row < 9; row++) {
      const rowCells: SudokuCell[] = []
      for (let col = 0; col < 9; col++) {
        rowCells.push({
          row,
          col,
          value,
          isInitial: true,
          isError: false,
        })
        value = (value % 9) + 1
      }
      board.push(rowCells)
    }
    
    const { result } = renderHook(() => useRemainingCounts(board))
    
    for (let num = 1; num <= 9; num++) {
      expect(result.current[num]).toBe(0)
    }
  })
})
