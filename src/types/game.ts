export type { Difficulty } from './sudoku'

export type CellState = {
  value: number | null
  isInitial: boolean
  isError: boolean
}

export type GameState = {
  board: CellState[][]
  difficulty: import('./sudoku').Difficulty
  timer: number
  errors: number
  maxErrors: number
  isComplete: boolean
  isPaused: boolean
  hints: number
  solution: (number | null)[][]
}

export type GameAction =
  | { type: 'NEW_GAME'; payload: { board: CellState[][]; difficulty: import('./sudoku').Difficulty; solution: (number | null)[][] } }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'SET_BOARD'; payload: CellState[][] }
  | { type: 'SET_CELL'; payload: { row: number; col: number; value: number | null } }
  | { type: 'SET_DIFFICULTY'; payload: import('./sudoku').Difficulty }
  | { type: 'INCREMENT_TIMER' }
  | { type: 'INCREMENT_ERRORS' }
  | { type: 'INCREMENT_HINTS' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'END_GAME' }
