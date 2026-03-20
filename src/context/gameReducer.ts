import type { GameState, GameAction, CellState } from '@/types/game'
import { MAX_ERRORS } from '@/constants/game'

export function createEmptyBoard(): CellState[][] {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({
          value: null,
          isInitial: false,
          isError: false,
        }))
    )
}

export function createBoardFromGrid(
  grid: (number | null)[][],
  initialPositions: Set<string> = new Set()
): CellState[][] {
  return grid.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      value,
      isInitial: initialPositions.has(`${rowIndex}-${colIndex}`) || value !== null,
      isError: false,
    }))
  )
}

export const initialGameState: GameState = {
  board: createEmptyBoard(),
  difficulty: 'medium',
  timer: 0,
  errors: 0,
  maxErrors: MAX_ERRORS,
  isComplete: false,
  isPaused: false,
  hints: 0,
  solution: Array(9).fill(null).map(() => Array(9).fill(null)),
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      return {
        ...initialGameState,
        board: action.payload.board,
        difficulty: action.payload.difficulty,
        solution: action.payload.solution,
      }
    }

    case 'LOAD_GAME': {
      return action.payload
    }

    case 'SET_BOARD': {
      return {
        ...state,
        board: action.payload,
      }
    }

    case 'SET_CELL': {
      const { row, col, value } = action.payload
      const newBoard = state.board.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri === row && ci === col) {
            return {
              ...cell,
              value,
              isError: false,
            }
          }
          return cell
        })
      )
      return {
        ...state,
        board: newBoard,
      }
    }

    case 'SET_DIFFICULTY': {
      return {
        ...state,
        difficulty: action.payload,
      }
    }

    case 'INCREMENT_TIMER': {
      return {
        ...state,
        timer: state.timer + 1,
      }
    }

    case 'INCREMENT_ERRORS': {
      const newErrors = state.errors + 1
      return {
        ...state,
        errors: newErrors,
        isComplete: newErrors >= state.maxErrors,
      }
    }

    case 'INCREMENT_HINTS': {
      return {
        ...state,
        hints: state.hints + 1,
      }
    }

    case 'COMPLETE_GAME': {
      return {
        ...state,
        isComplete: true,
      }
    }

    case 'PAUSE_GAME': {
      return {
        ...state,
        isPaused: true,
      }
    }

    case 'RESUME_GAME': {
      return {
        ...state,
        isPaused: false,
      }
    }

    case 'RESET_GAME': {
      return {
        ...state,
        board: state.board.map(row =>
          row.map(cell => ({
            ...cell,
            value: cell.isInitial ? cell.value : null,
            isError: false,
          }))
        ),
        timer: 0,
        errors: 0,
        hints: 0,
        isComplete: false,
        isPaused: false,
      }
    }

    default:
      return state
  }
}
