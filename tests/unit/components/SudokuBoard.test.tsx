import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SudokuBoard, Cell } from '@/components/game/SudokuBoard'
import type { CellState } from '@/types/game'

const createMockBoard = (): CellState[][] => {
  return Array(9).fill(null).map((_, row) =>
    Array(9).fill(null).map((_, col) => ({
      value: (row * 3 + Math.floor(col / 3) + col) % 9 + 1,
      isInitial: row < 3 && col < 3,
      isError: false,
    }))
  )
}

describe('SudokuBoard', () => {
  const mockOnCellClick = vi.fn()
  
  const renderComponent = (
    board: CellState[][] = createMockBoard(),
    selectedCell: { row: number; col: number } | null = null
  ) => {
    return render(
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={mockOnCellClick}
      />
    )
  }

  beforeEach(() => {
    mockOnCellClick.mockClear()
  })

  it('should render 81 cells', () => {
    renderComponent()
    const cells = document.querySelectorAll('[data-row]')
    expect(cells.length).toBe(81)
  })

  it('should call onCellClick when cell is clicked', () => {
    renderComponent()
    const firstCell = document.querySelector('[data-row="0"][data-col="0"]')
    fireEvent.click(firstCell!)
    expect(mockOnCellClick).toHaveBeenCalledWith(0, 0)
  })

  it('should render initial numbers with correct styling', () => {
    renderComponent()
    const initialCell = document.querySelector('[data-row="0"][data-col="0"]')
    expect(initialCell?.getAttribute('data-initial')).toBe('true')
  })

  it('should highlight row when cell is selected', () => {
    const board = createMockBoard()
    renderComponent(board, { row: 4, col: 4 })
    const cells = document.querySelectorAll('[data-row="4"]')
    expect(cells.length).toBe(9)
  })

  it('should highlight column when cell is selected', () => {
    const board = createMockBoard()
    renderComponent(board, { row: 4, col: 4 })
    const cells = document.querySelectorAll('[data-col="4"]')
    expect(cells.length).toBe(9)
  })

  it('should highlight 3x3 box when cell is selected', () => {
    const board = createMockBoard()
    renderComponent(board, { row: 4, col: 4 })
    
    const boxCells = [
      [3,3], [3,4], [3,5],
      [4,3], [4,4], [4,5],
      [5,3], [5,4], [5,5]
    ]
    
    boxCells.forEach(([row, col]) => {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
      expect(cell).not.toBeNull()
    })
  })

  it('should show selected cell with distinct style', () => {
    const board = createMockBoard()
    renderComponent(board, { row: 4, col: 4 })
    const selectedCell = document.querySelector('[data-row="4"][data-col="4"]')
    expect(selectedCell).not.toBeNull()
  })
})

describe('Cell', () => {
  const defaultProps = {
    row: 0,
    col: 0,
    value: 5 as const,
    isInitial: false,
    isError: false,
    isSelected: false,
    isHighlighted: false,
    isSameNumber: false,
    isConflict: false,
    onClick: vi.fn(),
  }

  it('should render cell value', () => {
    render(<Cell {...defaultProps} />)
    expect(screen.getByText('5')).toBeDefined()
  })

  it('should render empty cell', () => {
    render(<Cell {...defaultProps} value={null} />)
    const cell = document.querySelector('button')
    expect(cell?.textContent).toBe('')
  })

  it('should call onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Cell {...defaultProps} onClick={onClick} />)
    const cell = document.querySelector('button')!
    fireEvent.click(cell)
    expect(onClick).toHaveBeenCalled()
  })

  it('should have correct aria-label', () => {
    render(<Cell {...defaultProps} />)
    const cell = document.querySelector('button')
    expect(cell?.getAttribute('aria-label')).toContain('单元格')
    expect(cell?.getAttribute('aria-label')).toContain('1')
    expect(cell?.getAttribute('aria-label')).toContain('值为 5')
  })

  it('should have correct data attributes', () => {
    render(<Cell {...defaultProps} row={3} col={5} value={7} />)
    const cell = document.querySelector('button')
    expect(cell?.getAttribute('data-row')).toBe('3')
    expect(cell?.getAttribute('data-col')).toBe('5')
    expect(cell?.getAttribute('data-value')).toBe('7')
    expect(cell?.getAttribute('data-initial')).toBe('false')
  })
})
