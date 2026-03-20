export type SudokuCell = {
  row: number
  col: number
  value: number | null
  isInitial: boolean
  isError: boolean
}

export type SudokuBoard = SudokuCell[][]

export type SudokuGrid = (number | null)[][]

export type Position = {
  row: number
  col: number
}
