import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ControlPanel, ControlButton, DifficultyModal, ConfirmModal } from '@/components/game/ControlPanel'
import type { Difficulty, Position } from '@/types/sudoku'

function createEmptyBoard() {
  return Array(9)
    .fill(null)
    .map((_, row) =>
      Array(9)
        .fill(null)
        .map((_, col) => ({
          row,
          col,
          value: null,
          isInitial: false,
          isError: false,
        }))
    )
}

function createSolution(): (number | null)[][] {
  return Array(9)
    .fill(null)
    .map((_, row) =>
      Array(9)
        .fill(null)
        .map((_, col) => (row * 3 + Math.floor(col / 3) + col) % 9 + 1)
    )
}

describe('ControlButton', () => {
  it('renders with correct label and icon', () => {
    render(
      <ControlButton
        icon="ri-add-line"
        label="新游戏"
        color="blue"
        onClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '新游戏' })).toBeInTheDocument()
    expect(screen.getByRole('button').querySelector('i')).toHaveClass('ri-add-line')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <ControlButton
        icon="ri-add-line"
        label="新游戏"
        color="blue"
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <ControlButton
        icon="ri-add-line"
        label="新游戏"
        color="blue"
        onClick={onClick}
        disabled={true}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has correct color class', () => {
    const { rerender } = render(
      <ControlButton icon="ri-add-line" label="Test" color="blue" onClick={() => {}} />
    )
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')

    rerender(<ControlButton icon="ri-add-line" label="Test" color="red" onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })
})

describe('DifficultyModal', () => {
  it('renders when open', () => {
    render(
      <DifficultyModal
        isOpen={true}
        onClose={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.getByText('选择难度')).toBeInTheDocument()
    expect(screen.getByText('简单')).toBeInTheDocument()
    expect(screen.getByText('中等')).toBeInTheDocument()
    expect(screen.getByText('困难')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <DifficultyModal
        isOpen={false}
        onClose={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.queryByText('选择难度')).not.toBeInTheDocument()
  })

  it('calls onSelect with correct difficulty', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(
      <DifficultyModal
        isOpen={true}
        onClose={onClose}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByText('简单'))
    expect(onSelect).toHaveBeenCalledWith('easy')
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(
      <DifficultyModal
        isOpen={true}
        onClose={onClose}
        onSelect={() => {}}
      />
    )

    fireEvent.click(screen.getByText('取消'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <DifficultyModal
        isOpen={true}
        onClose={onClose}
        onSelect={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('ConfirmModal', () => {
  it('renders with title and message', () => {
    render(
      <ConfirmModal
        isOpen={true}
        title="确认操作"
        message="确定要执行此操作吗？"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('确认操作')).toBeInTheDocument()
    expect(screen.getByText('确定要执行此操作吗？')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        isOpen={true}
        title="确认"
        message="确定吗？"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const confirmButtons = screen.getAllByRole('button')
    const confirmBtn = confirmButtons.find(btn => btn.textContent === '确认' && btn.className.includes('bg-blue-600'))
    fireEvent.click(confirmBtn!)
    expect(onConfirm).toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        isOpen={true}
        title="确认"
        message="确定吗？"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    fireEvent.click(screen.getByText('取消'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('does not render when closed', () => {
    render(
      <ConfirmModal
        isOpen={false}
        title="确认"
        message="确定吗？"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.queryByText('确认')).not.toBeInTheDocument()
  })
})

describe('ControlPanel', () => {
  const defaultProps = {
    selectedCell: null as Position | null,
    board: createEmptyBoard(),
    solution: createSolution(),
    isGameComplete: false,
    onNewGame: vi.fn(),
    onReset: vi.fn(),
    onHint: vi.fn(),
    onCheck: vi.fn(),
    onEndGame: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all control buttons', () => {
    render(<ControlPanel {...defaultProps} />)

    expect(screen.getByRole('button', { name: '新游戏' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重置' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提示' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '检查' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '结束游戏' })).toBeInTheDocument()
  })

  it('opens difficulty modal when new game button is clicked', () => {
    render(<ControlPanel {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '新游戏' }))
    expect(screen.getByText('选择难度')).toBeInTheDocument()
  })

  it('calls onNewGame with selected difficulty', () => {
    const onNewGame = vi.fn()
    render(<ControlPanel {...defaultProps} onNewGame={onNewGame} />)

    fireEvent.click(screen.getByRole('button', { name: '新游戏' }))
    fireEvent.click(screen.getByText('困难'))

    expect(onNewGame).toHaveBeenCalledWith('hard')
  })

  it('opens reset confirm modal when reset button is clicked', () => {
    render(<ControlPanel {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '重置' }))
    expect(screen.getByText('确认重置')).toBeInTheDocument()
  })

  it('calls onReset when reset is confirmed', () => {
    const onReset = vi.fn()
    render(<ControlPanel {...defaultProps} onReset={onReset} />)

    fireEvent.click(screen.getByRole('button', { name: '重置' }))
    fireEvent.click(screen.getByText('确认'))

    expect(onReset).toHaveBeenCalled()
  })

  it('disables hint button when no cell is selected', () => {
    render(<ControlPanel {...defaultProps} selectedCell={null} />)

    expect(screen.getByRole('button', { name: '提示' })).toBeDisabled()
  })

  it('disables hint button when selected cell is initial', () => {
    const board = createEmptyBoard()
    board[0][0].isInitial = true
    board[0][0].value = 5

    render(<ControlPanel {...defaultProps} selectedCell={{ row: 0, col: 0 }} board={board} />)

    expect(screen.getByRole('button', { name: '提示' })).toBeDisabled()
  })

  it('disables hint button when selected cell has value', () => {
    const board = createEmptyBoard()
    board[0][0].value = 5

    render(<ControlPanel {...defaultProps} selectedCell={{ row: 0, col: 0 }} board={board} />)

    expect(screen.getByRole('button', { name: '提示' })).toBeDisabled()
  })

  it('enables hint button when selected cell is empty and not initial', () => {
    render(<ControlPanel {...defaultProps} selectedCell={{ row: 0, col: 0 }} />)

    expect(screen.getByRole('button', { name: '提示' })).not.toBeDisabled()
  })

  it('calls onHint with correct values when hint button is clicked', () => {
    const onHint = vi.fn()
    const solution = createSolution()
    solution[0][0] = 7

    render(
      <ControlPanel
        {...defaultProps}
        selectedCell={{ row: 0, col: 0 }}
        solution={solution}
        onHint={onHint}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '提示' }))
    expect(onHint).toHaveBeenCalledWith(0, 0, 7)
  })

  it('calls onCheck when check button is clicked', () => {
    const onCheck = vi.fn()
    render(<ControlPanel {...defaultProps} onCheck={onCheck} />)

    fireEvent.click(screen.getByRole('button', { name: '检查' }))
    expect(onCheck).toHaveBeenCalled()
  })

  it('opens end game confirm modal when end game button is clicked', () => {
    render(<ControlPanel {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '结束游戏' }))
    expect(screen.getByText('确认结束')).toBeInTheDocument()
  })

  it('calls onEndGame when end game is confirmed', () => {
    const onEndGame = vi.fn()
    render(<ControlPanel {...defaultProps} onEndGame={onEndGame} />)

    fireEvent.click(screen.getByRole('button', { name: '结束游戏' }))
    fireEvent.click(screen.getByText('确认'))

    expect(onEndGame).toHaveBeenCalled()
  })

  it('disables buttons when game is complete', () => {
    render(<ControlPanel {...defaultProps} isGameComplete={true} />)

    expect(screen.getByRole('button', { name: '重置' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '提示' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '检查' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '结束游戏' })).toBeDisabled()
  })

  it('onCheck returns correct error positions', async () => {
    const onCheck = vi.fn()
    const board = createEmptyBoard()
    const solution = createSolution()

    board[0][0].value = 1
    board[0][0].isInitial = false
    solution[0][0] = 9

    render(
      <ControlPanel
        {...defaultProps}
        board={board}
        solution={solution}
        onCheck={onCheck}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '检查' }))

    expect(onCheck).toHaveBeenCalledWith([{ row: 0, col: 0 }])
  })
})
