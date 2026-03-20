import { describe, it, expect } from 'vitest'
import {
  isValidPlacement,
  isValidSudoku,
  isSudokuComplete,
  getConflicts,
  getValidNumbers,
  findEmptyCell,
} from '@/algorithms/sudokuValidator'
import type { SudokuGrid } from '@/types/sudoku'

describe('sudokuValidator', () => {
  describe('isValidPlacement', () => {
    it('should return true for valid placement in empty cell', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(true)
      expect(isValidPlacement(grid, 4, 4, 9)).toBe(true)
      expect(isValidPlacement(grid, 8, 8, 1)).toBe(true)
    })

    it('should return false for invalid number range', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(isValidPlacement(grid, 0, 0, 0)).toBe(false)
      expect(isValidPlacement(grid, 0, 0, 10)).toBe(false)
      expect(isValidPlacement(grid, 0, 0, -1)).toBe(false)
    })

    it('should return false for invalid position', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(isValidPlacement(grid, -1, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 0, -1, 5)).toBe(false)
      expect(isValidPlacement(grid, 9, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 0, 9, 5)).toBe(false)
    })

    it('should return false for row conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][1] = 5
      
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 0, 8, 5)).toBe(false)
    })

    it('should return false for column conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[1][0] = 5
      
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 8, 0, 5)).toBe(false)
    })

    it('should return false for box conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[1][1] = 5
      
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 2, 2, 5)).toBe(false)
    })

    it('should return true when no conflict exists', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][1] = 5
      grid[1][0] = 5
      grid[6][6] = 5
      
      expect(isValidPlacement(grid, 3, 3, 5)).toBe(true)
    })
  })

  describe('isValidSudoku', () => {
    it('should return true for empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(isValidSudoku(grid)).toBe(true)
    })

    it('should return true for valid partial grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 1
      grid[0][1] = 2
      grid[1][0] = 3
      
      expect(isValidSudoku(grid)).toBe(true)
    })

    it('should return false for row conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[0][5] = 5
      
      expect(isValidSudoku(grid)).toBe(false)
    })

    it('should return false for column conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[5][0] = 5
      
      expect(isValidSudoku(grid)).toBe(false)
    })

    it('should return false for box conflict', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[2][2] = 5
      
      expect(isValidSudoku(grid)).toBe(false)
    })
  })

  describe('isSudokuComplete', () => {
    it('should return false for empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(isSudokuComplete(grid)).toBe(false)
    })

    it('should return false for partial grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 1
      
      expect(isSudokuComplete(grid)).toBe(false)
    })

    it('should return true for complete valid grid', () => {
      const grid: SudokuGrid = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ]
      
      expect(isSudokuComplete(grid)).toBe(true)
    })

    it('should return false for complete but invalid grid', () => {
      const grid: SudokuGrid = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 5],
      ]
      
      expect(isSudokuComplete(grid)).toBe(false)
    })
  })

  describe('getConflicts', () => {
    it('should return empty array for empty cell', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      expect(getConflicts(grid, 0, 0)).toEqual([])
    })

    it('should return row conflicts', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[0][5] = 5
      
      const conflicts = getConflicts(grid, 0, 0)
      expect(conflicts).toHaveLength(1)
      expect(conflicts[0]).toEqual({ row: 0, col: 5 })
    })

    it('should return column conflicts', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[5][0] = 5
      
      const conflicts = getConflicts(grid, 0, 0)
      expect(conflicts).toHaveLength(1)
      expect(conflicts[0]).toEqual({ row: 5, col: 0 })
    })

    it('should return box conflicts', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[2][2] = 5
      
      const conflicts = getConflicts(grid, 0, 0)
      expect(conflicts).toHaveLength(1)
      expect(conflicts[0]).toEqual({ row: 2, col: 2 })
    })

    it('should return multiple conflicts', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 5
      grid[0][5] = 5
      grid[5][0] = 5
      grid[2][2] = 5
      
      const conflicts = getConflicts(grid, 0, 0)
      expect(conflicts).toHaveLength(3)
    })
  })

  describe('getValidNumbers', () => {
    it('should return all numbers for empty cell in empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      const validNumbers = getValidNumbers(grid, 0, 0)
      expect(validNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    it('should exclude numbers in same row', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][1] = 1
      grid[0][2] = 2
      grid[0][3] = 3
      
      const validNumbers = getValidNumbers(grid, 0, 0)
      expect(validNumbers).not.toContain(1)
      expect(validNumbers).not.toContain(2)
      expect(validNumbers).not.toContain(3)
    })

    it('should exclude numbers in same column', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[1][0] = 1
      grid[2][0] = 2
      
      const validNumbers = getValidNumbers(grid, 0, 0)
      expect(validNumbers).not.toContain(1)
      expect(validNumbers).not.toContain(2)
    })

    it('should exclude numbers in same box', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[1][1] = 5
      grid[2][2] = 6
      
      const validNumbers = getValidNumbers(grid, 0, 0)
      expect(validNumbers).not.toContain(5)
      expect(validNumbers).not.toContain(6)
    })
  })

  describe('findEmptyCell', () => {
    it('should return first empty cell', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 1
      
      const emptyCell = findEmptyCell(grid)
      expect(emptyCell).toEqual({ row: 0, col: 1 })
    })

    it('should return null for complete grid', () => {
      const grid: SudokuGrid = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ]
      
      expect(findEmptyCell(grid)).toBeNull()
    })

    it('should return null for empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      const emptyCell = findEmptyCell(grid)
      expect(emptyCell).toEqual({ row: 0, col: 0 })
    })
  })
})
