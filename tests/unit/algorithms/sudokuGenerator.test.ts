import { describe, it, expect } from 'vitest'
import {
  generateCompleteSudoku,
  generateSudokuPuzzle,
  deepCopyGrid,
} from '@/algorithms/sudokuGenerator'
import { isValidSudoku, isSudokuComplete } from '@/algorithms/sudokuValidator'
import type { SudokuGrid, Difficulty } from '@/types/sudoku'

describe('sudokuGenerator', () => {
  describe('generateCompleteSudoku', () => {
    it('should generate a 9x9 grid', () => {
      const grid = generateCompleteSudoku()
      
      expect(grid).toHaveLength(9)
      grid.forEach(row => {
        expect(row).toHaveLength(9)
      })
    })

    it('should generate a valid complete sudoku', () => {
      const grid = generateCompleteSudoku()
      
      expect(isValidSudoku(grid)).toBe(true)
      expect(isSudokuComplete(grid)).toBe(true)
    })

    it('should have all cells filled with numbers 1-9', () => {
      const grid = generateCompleteSudoku()
      
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).not.toBeNull()
          expect(cell).toBeGreaterThanOrEqual(1)
          expect(cell).toBeLessThanOrEqual(9)
        })
      })
    })

    it('should generate different sudokus on multiple calls', () => {
      const grid1 = generateCompleteSudoku()
      const grid2 = generateCompleteSudoku()
      
      let hasDifference = false
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid1[row][col] !== grid2[row][col]) {
            hasDifference = true
            break
          }
        }
        if (hasDifference) break
      }
      
      expect(hasDifference).toBe(true)
    })

    it('should generate within 500ms', () => {
      const startTime = performance.now()
      generateCompleteSudoku()
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(500)
    })
  })

  describe('generateSudokuPuzzle', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

    difficulties.forEach(difficulty => {
      it(`should generate valid puzzle for ${difficulty} difficulty`, () => {
        const { puzzle, solution } = generateSudokuPuzzle(difficulty)
        
        expect(isValidSudoku(puzzle)).toBe(true)
        expect(isSudokuComplete(solution)).toBe(true)
      })

      it(`should have correct empty cells for ${difficulty} difficulty`, () => {
        const { puzzle } = generateSudokuPuzzle(difficulty)
        
        let emptyCount = 0
        puzzle.forEach(row => {
          row.forEach(cell => {
            if (cell === null) emptyCount++
          })
        })

        const expectedRanges = {
          easy: { min: 30, max: 35 },
          medium: { min: 40, max: 45 },
          hard: { min: 50, max: 55 },
        }

        expect(emptyCount).toBeGreaterThanOrEqual(expectedRanges[difficulty].min)
        expect(emptyCount).toBeLessThanOrEqual(expectedRanges[difficulty].max)
      })

      it(`puzzle should match solution for filled cells - ${difficulty}`, () => {
        const { puzzle, solution } = generateSudokuPuzzle(difficulty)
        
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (puzzle[row][col] !== null) {
              expect(puzzle[row][col]).toBe(solution[row][col])
            }
          }
        }
      })
    })

    it('should generate different puzzles on multiple calls', () => {
      const result1 = generateSudokuPuzzle('medium')
      const result2 = generateSudokuPuzzle('medium')
      
      let hasDifference = false
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (result1.puzzle[row][col] !== result2.puzzle[row][col]) {
            hasDifference = true
            break
          }
        }
        if (hasDifference) break
      }
      
      expect(hasDifference).toBe(true)
    })
  })

  describe('deepCopyGrid', () => {
    it('should create a deep copy of the grid', () => {
      const original: SudokuGrid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
      ]
      
      const copy = deepCopyGrid(original)
      
      expect(copy).toEqual(original)
      expect(copy).not.toBe(original)
      expect(copy[0]).not.toBe(original[0])
    })

    it('should not affect original when copy is modified', () => {
      const original: SudokuGrid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
      
      const copy = deepCopyGrid(original)
      copy[0][0] = 5
      
      expect(original[0][0]).toBeNull()
      expect(copy[0][0]).toBe(5)
    })
  })
})
