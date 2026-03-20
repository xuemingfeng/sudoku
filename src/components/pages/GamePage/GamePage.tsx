import { memo, useState, useCallback } from 'react'
import { GameContainer, Header, SudokuBoard, NumberPad, ControlPanel } from '@/components/game'
import type { SudokuCell, Position, Difficulty, SudokuGrid } from '@/types/sudoku'
import { generateSudokuPuzzle } from '@/algorithms/sudokuGenerator'
import { useTimer } from '@/hooks/useTimer'

function createInitialBoard(puzzle: SudokuGrid): SudokuCell[][] {
  return puzzle.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value,
      isInitial: value !== null,
      isError: false,
    }))
  )
}

const MAX_ERRORS = 3

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

export const GamePage = memo(function GamePage({
  onGameComplete,
  onGameFail,
  initialDifficulty = 'medium',
}: GamePageProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty)
  const [gameData, setGameData] = useState(() => {
    const { puzzle, solution } = generateSudokuPuzzle(initialDifficulty)
    return {
      board: createInitialBoard(puzzle),
      solution,
    }
  })
  const [selectedCell, setSelectedCell] = useState<Position | null>(null)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [isGameFailed, setIsGameFailed] = useState(false)
  const [timer, setTimer] = useState(0)
  const [errors, setErrors] = useState(0)
  const [hints, setHints] = useState(0)

  useTimer(!isGameComplete && !isGameFailed, useCallback(() => {
    setTimer(prev => prev + 1)
  }, []))

  const checkGameComplete = useCallback((board: SudokuCell[][]) => {
    return board.every(row =>
      row.every(cell => cell.value !== null && !cell.isError)
    )
  }, [])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameData.board[row][col].isInitial) {
      setSelectedCell({ row, col })
    }
  }, [gameData.board])

  const handleNumberClick = useCallback((number: number) => {
    if (!selectedCell || isGameComplete || isGameFailed) return
    const { row, col } = selectedCell
    if (gameData.board[row][col].isInitial) return

    const isError = gameData.solution[row][col] !== number
    let newErrors = errors

    if (isError) {
      newErrors = errors + 1
      setErrors(newErrors)

      if (newErrors >= MAX_ERRORS) {
        setIsGameFailed(true)
        onGameFail({
          time: timer,
          errors: newErrors,
          hints,
          difficulty,
        })
        return
      }
    }

    const newBoard = gameData.board.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value: number, isError }
        }
        return cell
      })
    )

    setGameData(prev => ({
      ...prev,
      board: newBoard,
    }))

    if (!isError && checkGameComplete(newBoard)) {
      setIsGameComplete(true)
      onGameComplete({
        time: timer,
        errors: newErrors,
        hints,
        difficulty,
      })
    }
  }, [selectedCell, gameData.board, gameData.solution, isGameComplete, isGameFailed, errors, timer, hints, difficulty, onGameComplete, onGameFail, checkGameComplete])

  const handleDeleteClick = useCallback(() => {
    if (!selectedCell || isGameComplete || isGameFailed) return
    const { row, col } = selectedCell
    if (gameData.board[row][col].isInitial) return

    setGameData(prev => ({
      ...prev,
      board: prev.board.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri === row && ci === col) {
            return { ...cell, value: null, isError: false }
          }
          return cell
        })
      ),
    }))
  }, [selectedCell, gameData.board, isGameComplete, isGameFailed])

  const handleNewGame = useCallback((newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudokuPuzzle(newDifficulty)
    setGameData({
      board: createInitialBoard(puzzle),
      solution,
    })
    setDifficulty(newDifficulty)
    setSelectedCell(null)
    setIsGameComplete(false)
    setIsGameFailed(false)
    setTimer(0)
    setErrors(0)
    setHints(0)
  }, [])

  const handleReset = useCallback(() => {
    setGameData(prev => ({
      ...prev,
      board: prev.board.map(row =>
        row.map(cell => ({
          ...cell,
          value: cell.isInitial ? cell.value : null,
          isError: false,
        }))
      ),
    }))
    setSelectedCell(null)
    setIsGameComplete(false)
    setIsGameFailed(false)
    setTimer(0)
    setErrors(0)
    setHints(0)
  }, [])

  const handleHint = useCallback((row: number, col: number, value: number) => {
    if (isGameComplete || isGameFailed) return

    setHints(prev => prev + 1)
    const newBoard = gameData.board.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return { ...cell, value, isError: false }
        }
        return cell
      })
    )

    setGameData(prev => ({
      ...prev,
      board: newBoard,
    }))

    if (checkGameComplete(newBoard)) {
      setIsGameComplete(true)
      onGameComplete({
        time: timer,
        errors,
        hints: hints + 1,
        difficulty,
      })
    }
  }, [gameData.board, isGameComplete, isGameFailed, timer, errors, hints, difficulty, onGameComplete, checkGameComplete])

  const handleCheck = useCallback((errorPositions: Position[]) => {
    const errorSet = new Set(errorPositions.map(e => `${e.row}-${e.col}`))

    setGameData(prev => ({
      ...prev,
      board: prev.board.map((row, ri) =>
        row.map((cell, ci) => ({
          ...cell,
          isError: errorSet.has(`${ri}-${ci}`),
        }))
      ),
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <GameContainer>
        <div className="flex flex-col gap-6">
          <Header
            timer={timer}
            errors={errors}
            maxErrors={MAX_ERRORS}
            difficulty={difficulty}
          />
          <ControlPanel
            selectedCell={selectedCell}
            board={gameData.board}
            solution={gameData.solution}
            isGameComplete={isGameComplete || isGameFailed}
            onNewGame={handleNewGame}
            onReset={handleReset}
            onHint={handleHint}
            onCheck={handleCheck}
            onEndGame={() => {}}
          />
          <SudokuBoard
            board={gameData.board}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <NumberPad
            selectedCell={selectedCell}
            board={gameData.board}
            onNumberClick={handleNumberClick}
            onDeleteClick={handleDeleteClick}
            isGameComplete={isGameComplete || isGameFailed}
          />
        </div>
      </GameContainer>
    </div>
  )
})
