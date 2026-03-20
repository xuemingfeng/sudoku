import { GameContainer, Header, SudokuBoard, NumberPad, ControlPanel } from '@/components/game'
import type { SudokuCell, Position } from '@/types/sudoku'
import { useState } from 'react'

function createEmptyBoard(): SudokuCell[][] {
  const board: SudokuCell[][] = []
  for (let row = 0; row < 9; row++) {
    const rowData: SudokuCell[] = []
    for (let col = 0; col < 9; col++) {
      const value = (row * 3 + Math.floor(col / 3) + col) % 9 + 1
      const isInitial = Math.random() > 0.6
      rowData.push({
        row,
        col,
        value: isInitial ? value : null,
        isInitial,
        isError: false
      })
    }
    board.push(rowData)
  }
  return board
}

function App() {
  const [board, setBoard] = useState<SudokuCell[][]>(createEmptyBoard)
  const [selectedCell, setSelectedCell] = useState<Position | null>(null)

  const handleCellClick = (row: number, col: number) => {
    if (!board[row][col].isInitial) {
      setSelectedCell({ row, col })
    }
  }

  const handleNumberClick = (number: number) => {
    if (selectedCell) {
      const newBoard = board.map(row => row.map(cell => ({ ...cell })))
      newBoard[selectedCell.row][selectedCell.col].value = number
      setBoard(newBoard)
    }
  }

  const handleDeleteClick = () => {
    if (selectedCell) {
      const newBoard = board.map(row => row.map(cell => ({ ...cell })))
      newBoard[selectedCell.row][selectedCell.col].value = null
      setBoard(newBoard)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <GameContainer>
        <div className="flex flex-col gap-6">
          <Header 
            timer="05:23" 
            errors="1/3" 
            difficulty="中等" 
          />
          <ControlPanel
            onNewGame={() => setBoard(createEmptyBoard())}
            onReset={() => setBoard(createEmptyBoard())}
            onHint={() => {}}
            onCheck={() => {}}
            onEndGame={() => {}}
          />
          <SudokuBoard 
            board={board} 
            selectedCell={selectedCell} 
            onCellClick={handleCellClick} 
          />
          <NumberPad
            selectedCell={selectedCell}
            board={board}
            onNumberClick={handleNumberClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </GameContainer>
    </div>
  )
}

export default App
