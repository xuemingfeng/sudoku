export type Difficulty = 'easy' | 'medium' | 'hard'

export type CellState = {
  value: number | null
  isInitial: boolean
  isError: boolean
}

export type GameState = {
  board: CellState[][]
  difficulty: Difficulty
  timer: number
  errors: number
  maxErrors: number
  isComplete: boolean
  isPaused: boolean
}

export type GameAction =
  | { type: 'SET_BOARD'; payload: CellState[][] }
  | { type: 'SET_CELL'; payload: { row: number; col: number; value: number | null } }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'INCREMENT_TIMER' }
  | { type: 'INCREMENT_ERRORS' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
