import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDisabledNumbers } from '@/hooks/useDisabledNumbers'
import type { SudokuCell, Position } from '@/types/sudoku'

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

function createBoardWithValues(
  values: Array<{ row: number; col: number; value: number; isInitial?: boolean }>
): SudokuCell[][] {
  const board = createEmptyBoard()
  values.forEach(({ row, col, value, isInitial = false }) => {
    board[row][col] = {
      row,
      col,
      value,
      isInitial,
      isError: false,
    }
  })
  return board
}

function createRemainingCounts(overrides: Partial<Record<number, number>> = {}): Record<number, number> {
  return {
    1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9,
    ...overrides,
  }
}

describe('useDisabledNumbers', () => {
  it('should disable numbers with 0 remaining count', () => {
    const board = createEmptyBoard()
    const remainingCounts = createRemainingCounts({ 5: 0, 7: 0 })
    
    const { result } = renderHook(() =>
      useDisabledNumbers(null, board, remainingCounts)
    )
    
    expect(result.current.has(5)).toBe(true)
    expect(result.current.has(7)).toBe(true)
    expect(result.current.has(1)).toBe(false)
    expect(result.current.has(9)).toBe(false)
  })

  it('should disable all numbers when initial cell selected', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])
    const selectedCell: Position = { row: 0, col: 0 }
    const remainingCounts = createRemainingCounts()
    
    const { result } = renderHook(() =>
      useDisabledNumbers(selectedCell, board, remainingCounts)
    )
    
    for (let num = 1; num <= 9; num++) {
      expect(result.current.has(num)).toBe(true)
    }
  })

  it('should not disable any numbers when non-initial empty cell selected', () => {
    const board = createEmptyBoard()
    const selectedCell: Position = { row: 0, col: 0 }
    const remainingCounts = createRemainingCounts()
    
    const { result } = renderHook(() =>
      useDisabledNumbers(selectedCell, board, remainingCounts)
    )
    
    expect(result.current.size).toBe(0)
  })

  it('should return empty set when no cell selected and all counts > 0', () => {
    const board = createEmptyBoard()
    const remainingCounts = createRemainingCounts()
    
    const { result } = renderHook(() =>
      useDisabledNumbers(null, board, remainingCounts)
    )
    
    expect(result.current.size).toBe(0)
  })

  it('should memoize results', () => {
    const board = createEmptyBoard()
    const remainingCounts = createRemainingCounts()
    
    const { result, rerender } = renderHook(() =>
      useDisabledNumbers(null, board, remainingCounts)
    )
    
    const firstResult = result.current
    
    rerender()
    
    expect(result.current).toBe(firstResult)
  })

  it('should update when selected cell changes', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])
    const remainingCounts = createRemainingCounts()
    
    const { result, rerender } = renderHook(
      ({ selectedCell }) => useDisabledNumbers(selectedCell, board, remainingCounts),
      { initialProps: { selectedCell: null as Position | null } }
    )
    
    expect(result.current.size).toBe(0)
    
    rerender({ selectedCell: { row: 0, col: 0 } })
    
    expect(result.current.size).toBe(9)
  })

  it('should combine remaining count and initial cell restrictions', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])
    const remainingCounts = createRemainingCounts({ 3: 0, 7: 0 })
    const selectedCell: Position = { row: 0, col: 0 }
    
    const { result } = renderHook(() =>
      useDisabledNumbers(selectedCell, board, remainingCounts)
    )
    
    expect(result.current.has(3)).toBe(true)
    expect(result.current.has(7)).toBe(true)
    expect(result.current.has(5)).toBe(true)
    expect(result.current.size).toBe(9)
  })

  it('should handle empty cell selection', () => {
    const board = createEmptyBoard()
    const selectedCell: Position = { row: 4, col: 4 }
    const remainingCounts = createRemainingCounts()
    
    const { result } = renderHook(() =>
      useDisabledNumbers(selectedCell, board, remainingCounts)
    )
    
    expect(result.current.size).toBe(0)
  })

  it('should handle cell with value but not initial', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: false },
    ])
    const selectedCell: Position = { row: 0, col: 0 }
    const remainingCounts = createRemainingCounts({ 5: 8 })
    
    const { result } = renderHook(() =>
      useDisabledNumbers(selectedCell, board, remainingCounts)
    )
    
    expect(result.current.size).toBe(0)
  })
})
