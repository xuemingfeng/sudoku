import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SudokuBoard } from '@/components/game/SudokuBoard/SudokuBoard'
import type { CellState } from '@/types/game'

function createEmptyBoard(): CellState[][] {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: null,
      isInitial: false,
      isError: false,
    }))
  )
}

function createBoardWithValues(
  values: Array<{ row: number; col: number; value: number; isInitial?: boolean }>
): CellState[][] {
  const board = createEmptyBoard()
  values.forEach(({ row, col, value, isInitial = false }) => {
    board[row][col] = {
      value,
      isInitial,
      isError: false,
    }
  })
  return board
}

describe('SudokuBoard', () => {
  it('should render 9x9 grid', () => {
    const board = createEmptyBoard()
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const cells = screen.getAllByRole('button')
    expect(cells).toHaveLength(81)
  })

  it('should highlight selected cell', () => {
    const board = createEmptyBoard()
    const onCellClick = vi.fn()
    const selectedCell = { row: 0, col: 0 }
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={onCellClick}
      />
    )
    
    const cell = screen.getByRole('button', { name: /单元格 1行 1列/ })
    expect(cell).toHaveClass('bg-blue-200')
  })

  it('should highlight same row, col, and box', () => {
    const board = createEmptyBoard()
    const onCellClick = vi.fn()
    const selectedCell = { row: 4, col: 4 }
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={onCellClick}
      />
    )
    
    const sameRowCell = screen.getByRole('button', { name: /单元格 5行 1列/ })
    const sameColCell = screen.getByRole('button', { name: /单元格 1行 5列/ })
    const sameBoxCell = screen.getByRole('button', { name: /单元格 4行 4列/ })
    const otherCell = screen.getByRole('button', { name: /单元格 1行 1列/ })
    
    expect(sameRowCell).toHaveClass('bg-slate-100')
    expect(sameColCell).toHaveClass('bg-slate-100')
    expect(sameBoxCell).toHaveClass('bg-slate-100')
    expect(otherCell).not.toHaveClass('bg-slate-100')
  })

  it('should highlight same numbers', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
      { row: 4, col: 4, value: 5 },
      { row: 2, col: 2, value: 3 },
    ])
    const onCellClick = vi.fn()
    const selectedCell = { row: 0, col: 0 }
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={onCellClick}
      />
    )
    
    const cellWith5 = screen.getByRole('button', { name: /单元格 5行 5列，值为 5/ })
    expect(cellWith5).toHaveClass('bg-blue-100')
    
    const cellWith3 = screen.getByRole('button', { name: /单元格 3行 3列，值为 3/ })
    expect(cellWith3).not.toHaveClass('bg-blue-100')
  })

  it('should show conflicts', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
      { row: 0, col: 1, value: 5 },
    ])
    const onCellClick = vi.fn()
    const selectedCell = { row: 0, col: 0 }
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={onCellClick}
      />
    )
    
    const conflictCell = screen.getByRole('button', { name: /单元格 1行 2列，值为 5/ })
    expect(conflictCell).toHaveClass('bg-red-100')
  })

  it('should call onCellClick when cell clicked', () => {
    const board = createEmptyBoard()
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const cell = screen.getByRole('button', { name: /单元格 5行 5列/ })
    fireEvent.click(cell)
    
    expect(onCellClick).toHaveBeenCalledWith(4, 4)
  })

  it('should display cell values', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 1 },
      { row: 0, col: 1, value: 2 },
      { row: 0, col: 2, value: 3 },
    ])
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should show initial cell style', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const cell = screen.getByRole('button', { name: /单元格 1行 1列，值为 5/ })
    expect(cell).toHaveClass('bg-blue-50')
  })

  it('should show error style', () => {
    const board = createEmptyBoard()
    board[0][0] = {
      value: 5,
      isInitial: false,
      isError: true,
    }
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const cell = screen.getByRole('button', { name: /单元格 1行 1列，值为 5/ })
    expect(cell).toHaveClass('text-red-500')
  })

  it('should have correct aria-labels', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
    ])
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const filledCell = screen.getByRole('button', { name: /单元格 1行 1列，值为 5/ })
    expect(filledCell).toHaveAttribute('aria-label', '单元格 1行 1列，值为 5')
    
    const emptyCell = screen.getByRole('button', { name: /单元格 1行 2列，空/ })
    expect(emptyCell).toHaveAttribute('aria-label', '单元格 1行 2列，空')
  })

  it('should have correct data attributes', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5, isInitial: true },
    ])
    const onCellClick = vi.fn()
    
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />
    )
    
    const cell = screen.getByRole('button', { name: /单元格 1行 1列，值为 5/ })
    expect(cell).toHaveAttribute('data-row', '0')
    expect(cell).toHaveAttribute('data-col', '0')
    expect(cell).toHaveAttribute('data-value', '5')
    expect(cell).toHaveAttribute('data-initial', 'true')
  })
})
