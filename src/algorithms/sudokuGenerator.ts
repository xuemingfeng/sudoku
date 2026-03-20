import type { SudokuGrid, Difficulty } from '@/types/sudoku'
import { GRID_SIZE } from '@/constants/game'
import { isValidPlacement, findEmptyCell } from './sudokuValidator'
import { createPuzzleFromSolution } from './difficultyController'

function createEmptyGrid(): SudokuGrid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null))
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function solveSudoku(grid: SudokuGrid): boolean {
  const emptyCell = findEmptyCell(grid)
  
  if (!emptyCell) {
    return true
  }

  const { row, col } = emptyCell
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

  for (const num of numbers) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num

      if (solveSudoku(grid)) {
        return true
      }

      grid[row][col] = null
    }
  }

  return false
}

export function generateCompleteSudoku(): SudokuGrid {
  const grid = createEmptyGrid()
  solveSudoku(grid)
  return grid
}

export function generateSudokuPuzzle(difficulty: Difficulty): {
  puzzle: SudokuGrid
  solution: SudokuGrid
} {
  const solution = generateCompleteSudoku()
  const puzzle = createPuzzleFromSolution(solution, difficulty)
  
  return { puzzle, solution }
}

export function deepCopyGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row])
}
