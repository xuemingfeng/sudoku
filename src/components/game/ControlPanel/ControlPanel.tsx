import { useState, useCallback, useMemo } from 'react'
import type { Difficulty, Position, SudokuGrid } from '@/types/sudoku'
import { ControlButton } from './ControlButton'
import { DifficultyModal } from './DifficultyModal'
import { ConfirmModal } from './ConfirmModal'

type ControlPanelProps = {
  selectedCell: Position | null
  board: { value: number | null; isInitial: boolean }[][]
  solution: SudokuGrid
  isGameComplete: boolean
  isGameStarted: boolean
  onNewGame: (difficulty: Difficulty) => void
  onReset: () => void
  onHint: (row: number, col: number, value: number) => void
  onCheck: (errors: Position[]) => void
  onEndGame: () => void
}

export function ControlPanel({
  selectedCell,
  board,
  solution,
  isGameComplete,
  isGameStarted,
  onNewGame,
  onReset,
  onHint,
  onCheck,
  onEndGame,
}: ControlPanelProps) {
  const [difficultyModalOpen, setDifficultyModalOpen] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [endGameModalOpen, setEndGameModalOpen] = useState(false)

  const handleNewGame = useCallback(() => {
    setDifficultyModalOpen(true)
  }, [])

  const handleSelectDifficulty = useCallback(
    (difficulty: Difficulty) => {
      onNewGame(difficulty)
    },
    [onNewGame]
  )

  const handleReset = useCallback(() => {
    setResetModalOpen(true)
  }, [])

  const handleConfirmReset = useCallback(() => {
    onReset()
  }, [onReset])

  const handleHint = useCallback(() => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    const cell = board[row][col]
    if (cell.isInitial || cell.value !== null) return
    const correctValue = solution[row][col]
    if (correctValue !== null) {
      onHint(row, col, correctValue)
    }
  }, [selectedCell, board, solution, onHint])

  const handleCheck = useCallback(() => {
    const errors: Position[] = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col]
        if (cell.value !== null && !cell.isInitial) {
          if (cell.value !== solution[row][col]) {
            errors.push({ row, col })
          }
        }
      }
    }
    onCheck(errors)
  }, [board, solution, onCheck])

  const handleEndGame = useCallback(() => {
    setEndGameModalOpen(true)
  }, [])

  const handleConfirmEndGame = useCallback(() => {
    onEndGame()
  }, [onEndGame])

  const isHintDisabled = useMemo(() => {
    if (!isGameStarted) return true
    if (isGameComplete) return true
    if (!selectedCell) return true
    const cell = board[selectedCell.row][selectedCell.col]
    if (cell.isInitial) return true
    if (cell.value !== null) return true
    return false
  }, [selectedCell, board, isGameComplete, isGameStarted])

  return (
    <>
      <div className="flex gap-2 sm:gap-3 w-full">
        <ControlButton
          icon="ri-add-line"
          label="新游戏"
          color="blue"
          onClick={handleNewGame}
        />
        <ControlButton
          icon="ri-refresh-line"
          label="重置"
          color="slate"
          onClick={handleReset}
          disabled={!isGameStarted || isGameComplete}
        />
        <ControlButton
          icon="ri-lightbulb-line"
          label="提示"
          color="amber"
          onClick={handleHint}
          disabled={isHintDisabled}
        />
        <ControlButton
          icon="ri-check-line"
          label="检查"
          color="green"
          onClick={handleCheck}
          disabled={!isGameStarted || isGameComplete}
        />
        <ControlButton
          icon="ri-close-line"
          label="结束游戏"
          color="red"
          onClick={handleEndGame}
          disabled={!isGameStarted || isGameComplete}
        />
      </div>

      <DifficultyModal
        isOpen={difficultyModalOpen}
        onClose={() => setDifficultyModalOpen(false)}
        onSelect={handleSelectDifficulty}
      />

      <ConfirmModal
        isOpen={resetModalOpen}
        title="确认重置"
        message="确定要重置游戏吗？所有已填写的内容将被清除。"
        confirmText="确认"
        cancelText="取消"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />

      <ConfirmModal
        isOpen={endGameModalOpen}
        title="确认结束"
        message="确定要结束当前游戏吗？当前进度将被保存。"
        confirmText="确认"
        cancelText="取消"
        onConfirm={handleConfirmEndGame}
        onCancel={() => setEndGameModalOpen(false)}
      />
    </>
  )
}
