import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberPad, NumberButton, DeleteButton } from '@/components/game/NumberPad'
import type { SudokuCell } from '@/types/sudoku'

function createEmptyBoard(): SudokuCell[][] {
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

function createBoardWithValues(values: Array<{ row: number; col: number; value: number; isInitial?: boolean }>): SudokuCell[][] {
  const board = createEmptyBoard()
  values.forEach(({ row, col, value, isInitial = false }) => {
    board[row][col] = { row, col, value, isInitial, isError: false }
  })
  return board
}

describe('NumberButton', () => {
  it('renders number and remaining count', () => {
    const onClick = vi.fn()
    render(
      <NumberButton
        number={5}
        remainingCount={3}
        isDisabled={false}
        onClick={onClick}
      />
    )

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onClick when clicked and not disabled', () => {
    const onClick = vi.fn()
    render(
      <NumberButton
        number={5}
        remainingCount={3}
        isDisabled={false}
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledWith(5)
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has correct aria-label', () => {
    render(
      <NumberButton
        number={7}
        remainingCount={2}
        isDisabled={false}
        onClick={() => {}}
      />
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', '数字 7，剩余 2 个')
  })

  it('has disabled styles when disabled', () => {
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={() => {}}
      />
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-slate-100')
    expect(button).toHaveClass('text-slate-300')
  })
})

describe('DeleteButton', () => {
  it('renders delete icon', () => {
    render(<DeleteButton isDisabled={false} onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button').querySelector('i')).toHaveClass('ri-delete-back-line')
  })

  it('calls onClick when clicked and not disabled', () => {
    const onClick = vi.fn()
    render(<DeleteButton isDisabled={false} onClick={onClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<DeleteButton isDisabled={true} onClick={onClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has correct aria-label', () => {
    render(<DeleteButton isDisabled={false} onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', '删除')
  })
})

describe('NumberPad', () => {
  it('renders all 9 number buttons', () => {
    const board = createEmptyBoard()
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    for (let i = 1; i <= 9; i++) {
      expect(screen.getByRole('button', { name: new RegExp(`数字 ${i}`) })).toBeInTheDocument()
    }
  })

  it('renders delete button', () => {
    const board = createEmptyBoard()
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '删除' })).toBeInTheDocument()
  })

  it('shows correct remaining counts', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 1 },
      { row: 0, col: 1, value: 1 },
      { row: 0, col: 2, value: 2 },
      { row: 0, col: 3, value: 5 },
      { row: 0, col: 4, value: 5 },
      { row: 0, col: 5, value: 5 },
    ])

    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    const button1 = buttons[0]
    const button2 = buttons[1]
    const button5 = buttons[4]

    expect(button1).toHaveTextContent('7')
    expect(button2).toHaveTextContent('8')
    expect(button5).toHaveTextContent('6')
  })

  it('disables number buttons when remaining count is 0', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 1 },
      { row: 0, col: 1, value: 1 },
      { row: 0, col: 2, value: 1 },
      { row: 0, col: 3, value: 1 },
      { row: 0, col: 4, value: 1 },
      { row: 0, col: 5, value: 1 },
      { row: 0, col: 6, value: 1 },
      { row: 0, col: 7, value: 1 },
      { row: 0, col: 8, value: 1 },
    ])

    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    const button1 = screen.getAllByRole('button')[0]
    expect(button1).toBeDisabled()
  })

  it('disables all buttons when game is complete', () => {
    const board = createEmptyBoard()
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
        isGameComplete={true}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('disables delete button when no cell is selected', () => {
    const board = createEmptyBoard()
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '删除' })).toBeDisabled()
  })

  it('disables delete button when selected cell is initial', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '删除' })).toBeDisabled()
  })

  it('disables delete button when selected cell is empty', () => {
    const board = createEmptyBoard()
    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '删除' })).toBeDisabled()
  })

  it('enables delete button when selected cell has user value', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: false },
    ])

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: '删除' })).not.toBeDisabled()
  })

  it('calls onNumberClick with correct number', () => {
    const onNumberClick = vi.fn()
    const board = createEmptyBoard()

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '数字 5，剩余 9 个' }))
    expect(onNumberClick).toHaveBeenCalledWith(5)
  })

  it('calls onDeleteClick when delete button is clicked', () => {
    const onDeleteClick = vi.fn()
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: false },
    ])

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={onDeleteClick}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '删除' }))
    expect(onDeleteClick).toHaveBeenCalled()
  })

  it('disables invalid numbers for selected cell', () => {
    const board = createBoardWithValues([
      { row: 0, col: 1, value: 5, isInitial: true },
      { row: 1, col: 0, value: 3, isInitial: true },
    ])

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    const button5 = buttons[4]
    const button3 = buttons[2]

    expect(button5).toBeDisabled()
    expect(button3).toBeDisabled()
  })

  it('disables all number buttons when selected cell is initial', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])

    render(
      <NumberPad
        selectedCell={{ row: 0, col: 0 }}
        board={board}
        onNumberClick={() => {}}
        onDeleteClick={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button').slice(0, 9)
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })
})
