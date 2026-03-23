import { useCallback, useMemo } from 'react'
import { useGameContext } from '@/context/GameContext'
import { generateSudokuPuzzle } from '@/algorithms/sudokuGenerator'
import { isSudokuComplete, isValidPlacement, getConflicts } from '@/algorithms/sudokuValidator'
import { countEmptyCells } from '@/algorithms/difficultyController'
import { saveGameState, clearGameState, saveBestRecord, saveGameHistory } from '@/utils/storage'
import type { Difficulty, Position } from '@/types/sudoku'

export function useGame() {
  const { state, dispatch } = useGameContext()

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty)
    
    const initialPositions = new Set<string>()
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null) {
          initialPositions.add(`${row}-${col}`)
        }
      }
    }

    const board = puzzle.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        isInitial: initialPositions.has(`${rowIndex}-${colIndex}`),
        isError: false,
      }))
    )

    dispatch({ type: 'NEW_GAME', payload: { board, difficulty, solution } })
    clearGameState()
  }, [dispatch])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [dispatch])

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' })
    clearGameState()
  }, [dispatch])

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' })
    saveGameState(state)
  }, [dispatch, state])

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' })
  }, [dispatch])

  const setCell = useCallback((row: number, col: number, value: number | null) => {
    if (state.board[row][col].isInitial) return
    if (state.isComplete || state.isPaused) return

    dispatch({ type: 'SET_CELL', payload: { row, col, value } })

    if (value !== null) {
      const conflicts = getConflicts(
        state.board.map(r => r.map(c => c.value)),
        row,
        col
      )
      if (conflicts.length > 0) {
        dispatch({ type: 'INCREMENT_ERRORS' })
      }
    }

    const newBoard = state.board.map((r, ri) =>
      r.map((c, ci) => {
        if (ri === row && ci === col) {
          return { ...c, value }
        }
        return c
      })
    )

    const gridForCheck = newBoard.map(r => r.map(c => c.value))
    if (isSudokuComplete(gridForCheck)) {
      dispatch({ type: 'COMPLETE_GAME' })
      clearGameState()
      
      saveBestRecord(state.difficulty, state.timer)
      saveGameHistory({
        difficulty: state.difficulty,
        time: state.timer,
        errors: state.errors,
        hints: state.hints,
        date: new Date().toISOString(),
        isComplete: true,
      })
    }
  }, [dispatch, state])

  const getRemainingCounts = useCallback((): Record<number, number> => {
    const counts: Record<number, number> = {}
    for (let i = 1; i <= 9; i++) {
      counts[i] = 9
    }

    state.board.forEach(row => {
      row.forEach(cell => {
        if (cell.value !== null) {
          counts[cell.value]--
        }
      })
    })

    return counts
  }, [state.board])

  const getValidNumbers = useCallback((row: number, col: number): number[] => {
    if (state.board[row][col].isInitial) return []
    
    const grid = state.board.map(r => r.map(c => c.value))
    const validNumbers: number[] = []

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, row, col, num)) {
        validNumbers.push(num)
      }
    }

    return validNumbers
  }, [state.board])

  const getHint = useCallback((): Position | null => {
    const emptyCells: Position[] = []
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (state.board[row][col].value === null) {
          emptyCells.push({ row, col })
        }
      }
    }

    if (emptyCells.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
  }, [state.board])

  const applyHint = useCallback((row: number, col: number) => {
    if (state.isComplete || state.isPaused) return
    if (state.board[row][col].isInitial) return
    if (state.board[row][col].value !== null) return

    const correctValue = state.solution[row][col]
    if (correctValue === null) return

    dispatch({ type: 'SET_CELL', payload: { row, col, value: correctValue } })
    dispatch({ type: 'INCREMENT_HINTS' })

    const newBoard = state.board.map((r, ri) =>
      r.map((c, ci) => {
        if (ri === row && ci === col) {
          return { ...c, value: correctValue, isError: false }
        }
        return c
      })
    )

    const gridForCheck = newBoard.map(r => r.map(c => c.value))
    if (isSudokuComplete(gridForCheck)) {
      dispatch({ type: 'COMPLETE_GAME' })
      clearGameState()
      
      saveBestRecord(state.difficulty, state.timer)
      saveGameHistory({
        difficulty: state.difficulty,
        time: state.timer,
        errors: state.errors,
        hints: state.hints + 1,
        date: new Date().toISOString(),
        isComplete: true,
      })
    }
  }, [dispatch, state])

  const isGameLost = useMemo(() => {
    return state.errors >= state.maxErrors
  }, [state.errors, state.maxErrors])

  const emptyCellsCount = useMemo(() => {
    return countEmptyCells(state.board.map(row => row.map(cell => cell.value)))
  }, [state.board])

  return {
    state,
    dispatch,
    startNewGame,
    resetGame,
    endGame,
    pauseGame,
    resumeGame,
    setCell,
    getRemainingCounts,
    getValidNumbers,
    getHint,
    applyHint,
    isGameLost,
    emptyCellsCount,
  }
}
