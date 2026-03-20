import { GameContainer, Header, SudokuBoard, NumberPad, ControlPanel } from '@/components/game'
import type { SudokuCell, Position, Difficulty, SudokuGrid } from '@/types/sudoku'
import { useState, useCallback } from 'react'
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

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [gameData, setGameData] = useState(() => {
    const { puzzle, solution } = generateSudokuPuzzle('medium')
    return {
      board: createInitialBoard(puzzle),
      solution,
    }
  })
  const [selectedCell, setSelectedCell] = useState<Position | null>(null)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [errors, setErrors] = useState(0)

  useTimer(!isGameComplete, useCallback(() => {
    setTimer(prev => prev + 1)
  }, []))

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameData.board[row][col].isInitial) {
      setSelectedCell({ row, col })
    }
  }, [gameData.board])

  const handleNumberClick = useCallback((number: number) => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    if (gameData.board[row][col].isInitial) return

    const isError = gameData.solution[row][col] !== number
    
    if (isError) {
      setErrors(prev => prev + 1)
    }

    setGameData(prev => ({
      ...prev,
      board: prev.board.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri === row && ci === col) {
            return { ...cell, value: number, isError }
          }
          return cell
        })
      ),
    }))
  }, [selectedCell, gameData.board, gameData.solution])

  const handleDeleteClick = useCallback(() => {
    if (!selectedCell) return
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
  }, [selectedCell, gameData.board])

  const handleNewGame = useCallback((newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudokuPuzzle(newDifficulty)
    setGameData({
      board: createInitialBoard(puzzle),
      solution,
    })
    setDifficulty(newDifficulty)
    setSelectedCell(null)
    setIsGameComplete(false)
    setTimer(0)
    setErrors(0)
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
    setTimer(0)
    setErrors(0)
  }, [])

  const handleHint = useCallback((row: number, col: number, value: number) => {
    setGameData(prev => ({
      ...prev,
      board: prev.board.map((r, ri) =>
        r.map((cell, ci) => {
          if (ri === row && ci === col) {
            return { ...cell, value, isError: false }
          }
          return cell
        })
      ),
    }))
  }, [])

  const handleCheck = useCallback((errors: Position[]) => {
    const errorSet = new Set(errors.map(e => `${e.row}-${e.col}`))
    
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

  const handleEndGame = useCallback(() => {
    setIsGameComplete(true)
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
            isGameComplete={isGameComplete}
            onNewGame={handleNewGame}
            onReset={handleReset}
            onHint={handleHint}
            onCheck={handleCheck}
            onEndGame={handleEndGame}
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
            isGameComplete={isGameComplete}
          />
        </div>
      </GameContainer>
    </div>
  )
}

export default App
