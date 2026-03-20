import { describe, it, expect } from 'vitest'
import {
  getHolesCount,
  createPuzzleFromSolution,
  countFilledCells,
  countEmptyCells,
  getDifficultyLabel,
} from '@/algorithms/difficultyController'
import type { SudokuGrid, Difficulty } from '@/types/sudoku'
import { DIFFICULTY_CONFIG } from '@/constants/game'

describe('difficultyController', () => {
  const completeSolution: SudokuGrid = [
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

  describe('getHolesCount', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

    difficulties.forEach(difficulty => {
      it(`should return holes count within range for ${difficulty}`, () => {
        const holesCount = getHolesCount(difficulty)
        const config = DIFFICULTY_CONFIG[difficulty]

        expect(holesCount).toBeGreaterThanOrEqual(config.minHoles)
        expect(holesCount).toBeLessThanOrEqual(config.maxHoles)
      })
    })

    it('should return different values on multiple calls', () => {
      const results = new Set<number>()
      
      for (let i = 0; i < 10; i++) {
        results.add(getHolesCount('medium'))
      }
      
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('createPuzzleFromSolution', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

    difficulties.forEach(difficulty => {
      it(`should create puzzle with correct empty cells for ${difficulty}`, () => {
        const puzzle = createPuzzleFromSolution(completeSolution, difficulty)
        const emptyCount = countEmptyCells(puzzle)
        const config = DIFFICULTY_CONFIG[difficulty]

        expect(emptyCount).toBeGreaterThanOrEqual(config.minHoles)
        expect(emptyCount).toBeLessThanOrEqual(config.maxHoles)
      })

      it(`should preserve solution values for filled cells - ${difficulty}`, () => {
        const puzzle = createPuzzleFromSolution(completeSolution, difficulty)

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (puzzle[row][col] !== null) {
              expect(puzzle[row][col]).toBe(completeSolution[row][col])
            }
          }
        }
      })

      it(`should not modify original solution - ${difficulty}`, () => {
        const originalCopy = completeSolution.map(row => [...row])
        createPuzzleFromSolution(completeSolution, difficulty)

        expect(completeSolution).toEqual(originalCopy)
      })
    })

    it('should create different puzzles on multiple calls', () => {
      const puzzle1 = createPuzzleFromSolution(completeSolution, 'medium')
      const puzzle2 = createPuzzleFromSolution(completeSolution, 'medium')

      let hasDifference = false
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle1[row][col] !== puzzle2[row][col]) {
            hasDifference = true
            break
          }
        }
        if (hasDifference) break
      }

      expect(hasDifference).toBe(true)
    })

    it('should create puzzle with 9x9 grid', () => {
      const puzzle = createPuzzleFromSolution(completeSolution, 'easy')

      expect(puzzle).toHaveLength(9)
      puzzle.forEach(row => {
        expect(row).toHaveLength(9)
      })
    })
  })

  describe('countFilledCells', () => {
    it('should return 0 for empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))

      expect(countFilledCells(grid)).toBe(0)
    })

    it('should return 81 for complete grid', () => {
      expect(countFilledCells(completeSolution)).toBe(81)
    })

    it('should return correct count for partial grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 1
      grid[0][1] = 2
      grid[1][0] = 3

      expect(countFilledCells(grid)).toBe(3)
    })
  })

  describe('countEmptyCells', () => {
    it('should return 81 for empty grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))

      expect(countEmptyCells(grid)).toBe(81)
    })

    it('should return 0 for complete grid', () => {
      expect(countEmptyCells(completeSolution)).toBe(0)
    })

    it('should return correct count for partial grid', () => {
      const grid: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      grid[0][0] = 1
      grid[0][1] = 2
      grid[1][0] = 3

      expect(countEmptyCells(grid)).toBe(78)
    })
  })

  describe('getDifficultyLabel', () => {
    it('should return correct label for easy', () => {
      expect(getDifficultyLabel('easy')).toBe('简单')
    })

    it('should return correct label for medium', () => {
      expect(getDifficultyLabel('medium')).toBe('中等')
    })

    it('should return correct label for hard', () => {
      expect(getDifficultyLabel('hard')).toBe('困难')
    })
  })
})
