import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberPad } from '@/components/game/NumberPad/NumberPad'
import type { SudokuCell, Position } from '@/types/sudoku'

function createEmptyBoard(): SudokuCell[][] {
  return Array(9).fill(null).map((_, rowIndex) =>
    Array(9).fill(null).map((_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value: null,
      isInitial: false,
      isError: false,
    }))
  )
}

function createBoardWithValues(
  values: Array<{ row: number; col: number; value: number }>
): SudokuCell[][] {
  const board = createEmptyBoard()
  values.forEach(({ row, col, value }) => {
    board[row][col] = {
      row,
      col,
      value,
      isInitial: false,
      isError: false,
    }
  })
  return board
}

describe('NumberPad', () => {
  it('should render 9 number buttons', () => {
    const board = createEmptyBoard()
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    for (let num = 1; num <= 9; num++) {
      expect(screen.getByRole('button', { name: new RegExp(`数字 ${num}`) })).toBeInTheDocument()
    }
  })

  it('should render delete button', () => {
    const board = createEmptyBoard()
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    expect(screen.getByRole('button', { name: '删除' })).toBeInTheDocument()
  })

  it('should show remaining counts', () => {
    const board = createBoardWithValues([
      { row: 0, col: 0, value: 5 },
      { row: 0, col: 1, value: 5 },
    ])
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const button5 = screen.getByRole('button', { name: /数字 5，剩余 7 个/ })
    expect(button5).toBeInTheDocument()
  })

  it('should disable numbers with 0 remaining', () => {
    const board = createBoardWithValues(
      Array(9).fill(null).map((_, i) => ({ row: Math.floor(i / 3), col: i % 3, value: 5 }))
    )
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const button5 = screen.getByRole('button', { name: /数字 5，剩余 0 个/ })
    expect(button5).toBeDisabled()
  })

  it('should disable all when game complete', () => {
    const board = createEmptyBoard()
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
        isGameComplete={true}
      />
    )
    
    for (let num = 1; num <= 9; num++) {
      const button = screen.getByRole('button', { name: new RegExp(`数字 ${num}`) })
      expect(button).toBeDisabled()
    }
  })

  it('should call onNumberClick', () => {
    const board = createEmptyBoard()
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const button5 = screen.getByRole('button', { name: /数字 5/ })
    fireEvent.click(button5)
    
    expect(onNumberClick).toHaveBeenCalledWith(5)
  })

  it('should call onDeleteClick', () => {
    const board = createBoardWithValues([{ row: 0, col: 0, value: 5 }])
    const selectedCell: Position = { row: 0, col: 0 }
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={selectedCell}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: '删除' })
    fireEvent.click(deleteButton)
    
    expect(onDeleteClick).toHaveBeenCalled()
  })

  it('should disable delete when no cell selected', () => {
    const board = createEmptyBoard()
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={null}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: '删除' })
    expect(deleteButton).toBeDisabled()
  })

  it('should disable delete when initial cell selected', () => {
    const board = createEmptyBoard()
    board[0][0] = {
      row: 0,
      col: 0,
      value: 5,
      isInitial: true,
      isError: false,
    }
    const selectedCell: Position = { row: 0, col: 0 }
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={selectedCell}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: '删除' })
    expect(deleteButton).toBeDisabled()
  })

  it('should disable delete when cell is empty', () => {
    const board = createEmptyBoard()
    const selectedCell: Position = { row: 0, col: 0 }
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={selectedCell}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: '删除' })
    expect(deleteButton).toBeDisabled()
  })

  it('should enable delete when cell has value', () => {
    const board = createBoardWithValues([{ row: 0, col: 0, value: 5 }])
    const selectedCell: Position = { row: 0, col: 0 }
    const onNumberClick = vi.fn()
    const onDeleteClick = vi.fn()
    
    render(
      <NumberPad
        selectedCell={selectedCell}
        board={board}
        onNumberClick={onNumberClick}
        onDeleteClick={onDeleteClick}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: '删除' })
    expect(deleteButton).not.toBeDisabled()
  })
})
