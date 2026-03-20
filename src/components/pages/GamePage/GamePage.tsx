import { memo, useCallback, useEffect, useState, useRef } from 'react'
import { GameContainer, Header, SudokuBoard, NumberPad, ControlPanel } from '@/components/game'
import type { SudokuCell, Position, Difficulty } from '@/types/sudoku'
import { useGame } from '@/hooks/useGame'
import { isSudokuComplete, getConflicts } from '@/algorithms/sudokuValidator'
import { clearGameState, saveBestRecord, saveGameHistory } from '@/utils/storage'

export type GameResult = {
  time: number
  errors: number
  hints: number
  difficulty: Difficulty
} | null

type GamePageProps = {
  onGameComplete: (result: GameResult) => void
  onGameFail: (result: GameResult) => void
  initialDifficulty?: Difficulty
}

function convertToSudokuCell(board: { value: number | null; isInitial: boolean; isError: boolean }[][]): SudokuCell[][] {
  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value: cell.value,
      isInitial: cell.isInitial,
      isError: cell.isError,
    }))
  )
}

export const GamePage = memo(function GamePage({
  onGameComplete,
  onGameFail,
  initialDifficulty = 'medium',
}: GamePageProps) {
  const { state, startNewGame, resetGame, setCell, applyHint } = useGame()
  const [selectedCell, setSelectedCell] = useState<Position | null>(null)
  const [timer, setTimer] = useState(0)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (state.isComplete || state.isPaused) return
    
    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [state.isComplete, state.isPaused])

  useEffect(() => {
    if (initializedRef.current) return
    
    const isEmptyBoard = state.board.every(row => 
      row.every(cell => cell.value === null)
    )
    const isEmptySolution = state.solution.every(row => 
      row.every(cell => cell === null)
    )
    if (isEmptyBoard && isEmptySolution) {
      initializedRef.current = true
      startNewGame(initialDifficulty)
    }
  }, [state.board, state.solution, initialDifficulty, startNewGame])

  useEffect(() => {
    if (state.isComplete && state.errors >= state.maxErrors) {
      onGameFail({
        time: timer,
        errors: state.errors,
        hints: state.hints,
        difficulty: state.difficulty,
      })
    }
  }, [state.isComplete, state.errors, state.maxErrors, timer, state.hints, state.difficulty, onGameFail])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!state.board[row][col].isInitial && !state.isComplete) {
      setSelectedCell({ row, col })
    }
  }, [state.board, state.isComplete])

  const handleNumberClick = useCallback((number: number) => {
    if (!selectedCell || state.isComplete) return
    const { row, col } = selectedCell
    if (state.board[row][col].isInitial) return

    const grid = state.board.map(r => r.map(c => c.value))
    grid[row][col] = number
    const conflicts = getConflicts(grid, row, col)
    const isError = conflicts.length > 0

    setCell(row, col, number)

    if (isError) {
      const newErrors = state.errors + 1
      if (newErrors >= state.maxErrors) {
        setTimeout(() => {
          onGameFail({
            time: timer,
            errors: newErrors,
            hints: state.hints,
            difficulty: state.difficulty,
          })
        }, 100)
        return
      }
    }

    const newBoard = state.board.map((r, ri) =>
      r.map((c, ci) => {
        if (ri === row && ci === col) {
          return { ...c, value: number, isError }
        }
        return c
      })
    )
    const gridForCheck = newBoard.map(r => r.map(c => c.value))
    if (!isError && isSudokuComplete(gridForCheck)) {
      clearGameState()
      saveBestRecord(state.difficulty, timer)
      saveGameHistory({
        difficulty: state.difficulty,
        time: timer,
        errors: state.errors,
        hints: state.hints,
        date: new Date().toISOString(),
        isComplete: true,
      })
      setTimeout(() => {
        onGameComplete({
          time: timer,
          errors: state.errors,
          hints: state.hints,
          difficulty: state.difficulty,
        })
      }, 100)
    }
  }, [selectedCell, state, setCell, timer, onGameComplete, onGameFail])

  const handleDeleteClick = useCallback(() => {
    if (!selectedCell || state.isComplete) return
    const { row, col } = selectedCell
    if (state.board[row][col].isInitial) return

    setCell(row, col, null)
  }, [selectedCell, state, setCell])

  const handleNewGame = useCallback((newDifficulty: Difficulty) => {
    startNewGame(newDifficulty)
    setSelectedCell(null)
    setTimer(0)
  }, [startNewGame])

  const handleReset = useCallback(() => {
    resetGame()
    setSelectedCell(null)
    setTimer(0)
  }, [resetGame])

  const handleHint = useCallback((row: number, col: number, value: number) => {
    if (state.isComplete) return
    
    applyHint(row, col)
    setSelectedCell({ row, col })
    
    const newBoard = state.board.map((r, ri) =>
      r.map((c, ci) => {
        if (ri === row && ci === col) {
          return { ...c, value, isError: false }
        }
        return c
      })
    )
    const gridForCheck = newBoard.map(r => r.map(c => c.value))
    if (isSudokuComplete(gridForCheck)) {
      clearGameState()
      saveBestRecord(state.difficulty, timer)
      saveGameHistory({
        difficulty: state.difficulty,
        time: timer,
        errors: state.errors,
        hints: state.hints + 1,
        date: new Date().toISOString(),
        isComplete: true,
      })
      setTimeout(() => {
        onGameComplete({
          time: timer,
          errors: state.errors,
          hints: state.hints + 1,
          difficulty: state.difficulty,
        })
      }, 100)
    }
  }, [state, applyHint, timer, onGameComplete])

  const handleCheck = useCallback((_errorPositions: Position[]) => {
    // Error marking is handled by the validator
  }, [])

  const handleEndGame = useCallback(() => {
    clearGameState()
  }, [])

  const sudokuBoard = convertToSudokuCell(state.board)

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <GameContainer>
        <div className="flex flex-col gap-6">
          <Header
            timer={timer}
            errors={state.errors}
            maxErrors={state.maxErrors}
            difficulty={state.difficulty}
          />
          <ControlPanel
            selectedCell={selectedCell}
            board={sudokuBoard}
            solution={state.solution}
            isGameComplete={state.isComplete}
            onNewGame={handleNewGame}
            onReset={handleReset}
            onHint={handleHint}
            onCheck={handleCheck}
            onEndGame={handleEndGame}
          />
          <SudokuBoard
            board={sudokuBoard}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <NumberPad
            selectedCell={selectedCell}
            board={sudokuBoard}
            onNumberClick={handleNumberClick}
            onDeleteClick={handleDeleteClick}
            isGameComplete={state.isComplete}
          />
        </div>
      </GameContainer>
    </div>
  )
})
