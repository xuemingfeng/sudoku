import type { SudokuGrid, Difficulty } from '@/types/sudoku'
import { GRID_SIZE, DIFFICULTY_CONFIG } from '@/constants/game'
import { deepCopyGrid } from './sudokuGenerator'

export function getHolesCount(difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIG[difficulty]
  return Math.floor(Math.random() * (config.maxHoles - config.minHoles + 1)) + config.minHoles
}

export function createPuzzleFromSolution(
  solution: SudokuGrid,
  difficulty: Difficulty
): SudokuGrid {
  const puzzle = deepCopyGrid(solution)
  const holesCount = getHolesCount(difficulty)
  
  const allPositions: { row: number; col: number }[] = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      allPositions.push({ row, col })
    }
  }

  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]]
  }

  for (let i = 0; i < holesCount; i++) {
    const { row, col } = allPositions[i]
    puzzle[row][col] = null
  }

  return puzzle
}

export function countFilledCells(grid: SudokuGrid): number {
  let count = 0
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        count++
      }
    }
  }
  return count
}

export function countEmptyCells(grid: SudokuGrid): number {
  return GRID_SIZE * GRID_SIZE - countFilledCells(grid)
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_CONFIG[difficulty].label
}
