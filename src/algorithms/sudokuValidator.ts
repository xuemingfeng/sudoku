import type { SudokuGrid, Position } from '@/types/sudoku'
import { GRID_SIZE, BOX_SIZE } from '@/constants/game'

export function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  if (num < 1 || num > 9) return false
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false

  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c] === num) return false
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][col] === num) return false
  }

  const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
  const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE

  for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
    for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
      if (grid[r][c] === num) return false
    }
  }

  return true
}

export function isValidSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const num = grid[row][col]
      if (num !== null) {
        const tempGrid = grid.map(r => [...r])
        tempGrid[row][col] = null
        if (!isValidPlacement(tempGrid, row, col, num)) {
          return false
        }
      }
    }
  }
  return true
}

export function isSudokuComplete(grid: SudokuGrid): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        return false
      }
    }
  }
  return isValidSudoku(grid)
}

export function getConflicts(
  grid: SudokuGrid,
  row: number,
  col: number
): Position[] {
  const conflicts: Position[] = []
  const num = grid[row][col]

  if (num === null) return conflicts

  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c] === num) {
      conflicts.push({ row, col: c })
    }
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col] === num) {
      conflicts.push({ row: r, col })
    }
  }

  const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
  const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE

  for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
    for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
      if (r !== row && c !== col && grid[r][c] === num) {
        conflicts.push({ row: r, col: c })
      }
    }
  }

  return conflicts
}

export function getValidNumbers(
  grid: SudokuGrid,
  row: number,
  col: number
): number[] {
  const validNumbers: number[] = []

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      validNumbers.push(num)
    }
  }

  return validNumbers
}

export function findEmptyCell(grid: SudokuGrid): Position | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        return { row, col }
      }
    }
  }
  return null
}
