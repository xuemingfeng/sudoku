import { describe, it, expect } from 'vitest'
import { gameReducer, initialGameState, createEmptyBoard, createBoardFromGrid } from '@/context/gameReducer'
import type { GameAction } from '@/types/game'

describe('gameReducer', () => {
  describe('createEmptyBoard', () => {
    it('should create a 9x9 board', () => {
      const board = createEmptyBoard()
      expect(board).toHaveLength(9)
      board.forEach(row => {
        expect(row).toHaveLength(9)
      })
    })

    it('should create board with all cells empty', () => {
      const board = createEmptyBoard()
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell.value).toBeNull()
          expect(cell.isInitial).toBe(false)
          expect(cell.isError).toBe(false)
        })
      })
    })
  })

  describe('createBoardFromGrid', () => {
    it('should create board from grid with correct values', () => {
      const grid = [
        [1, null, 3, null, null, null, null, null, null],
        [null, 2, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
      ]

      const board = createBoardFromGrid(grid)
      expect(board[0][0].value).toBe(1)
      expect(board[0][0].isInitial).toBe(true)
      expect(board[0][1].value).toBeNull()
      expect(board[0][1].isInitial).toBe(false)
      expect(board[0][2].value).toBe(3)
      expect(board[0][2].isInitial).toBe(true)
    })
  })

  describe('initialGameState', () => {
    it('should have correct initial values', () => {
      expect(initialGameState.difficulty).toBe('medium')
      expect(initialGameState.timer).toBe(0)
      expect(initialGameState.errors).toBe(0)
      expect(initialGameState.maxErrors).toBe(3)
      expect(initialGameState.isComplete).toBe(false)
      expect(initialGameState.isPaused).toBe(false)
    })
  })

  describe('NEW_GAME action', () => {
    it('should reset state and set new board', () => {
      const newBoard = createEmptyBoard()
      newBoard[0][0] = { value: 5, isInitial: true, isError: false }
      
      const action: GameAction = {
        type: 'NEW_GAME',
        payload: { board: newBoard, difficulty: 'hard' }
      }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.board).toEqual(newBoard)
      expect(newState.difficulty).toBe('hard')
      expect(newState.timer).toBe(0)
      expect(newState.errors).toBe(0)
      expect(newState.isComplete).toBe(false)
    })
  })

  describe('SET_CELL action', () => {
    it('should update cell value', () => {
      const action: GameAction = {
        type: 'SET_CELL',
        payload: { row: 0, col: 0, value: 5 }
      }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.board[0][0].value).toBe(5)
      expect(newState.board[0][0].isError).toBe(false)
    })

    it('should not modify other cells', () => {
      const action: GameAction = {
        type: 'SET_CELL',
        payload: { row: 4, col: 4, value: 9 }
      }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.board[0][0].value).toBeNull()
      expect(newState.board[4][4].value).toBe(9)
    })
  })

  describe('INCREMENT_TIMER action', () => {
    it('should increment timer by 1', () => {
      const action: GameAction = { type: 'INCREMENT_TIMER' }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.timer).toBe(1)
    })
  })

  describe('INCREMENT_ERRORS action', () => {
    it('should increment errors by 1', () => {
      const action: GameAction = { type: 'INCREMENT_ERRORS' }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.errors).toBe(1)
    })

    it('should set isComplete when max errors reached', () => {
      const state = { ...initialGameState, errors: 2 }
      const action: GameAction = { type: 'INCREMENT_ERRORS' }
      
      const newState = gameReducer(state, action)
      
      expect(newState.errors).toBe(3)
      expect(newState.isComplete).toBe(true)
    })
  })

  describe('PAUSE_GAME action', () => {
    it('should set isPaused to true', () => {
      const action: GameAction = { type: 'PAUSE_GAME' }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.isPaused).toBe(true)
    })
  })

  describe('RESUME_GAME action', () => {
    it('should set isPaused to false', () => {
      const state = { ...initialGameState, isPaused: true }
      const action: GameAction = { type: 'RESUME_GAME' }
      
      const newState = gameReducer(state, action)
      
      expect(newState.isPaused).toBe(false)
    })
  })

  describe('RESET_GAME action', () => {
    it('should reset timer and errors', () => {
      const state = {
        ...initialGameState,
        timer: 100,
        errors: 2,
        isComplete: false,
        isPaused: true,
      }
      
      const action: GameAction = { type: 'RESET_GAME' }
      
      const newState = gameReducer(state, action)
      
      expect(newState.timer).toBe(0)
      expect(newState.errors).toBe(0)
      expect(newState.isComplete).toBe(false)
      expect(newState.isPaused).toBe(false)
    })

    it('should clear non-initial cells', () => {
      const board = createEmptyBoard()
      board[0][0] = { value: 5, isInitial: true, isError: false }
      board[0][1] = { value: 3, isInitial: false, isError: true }
      
      const state = { ...initialGameState, board }
      const action: GameAction = { type: 'RESET_GAME' }
      
      const newState = gameReducer(state, action)
      
      expect(newState.board[0][0].value).toBe(5)
      expect(newState.board[0][1].value).toBeNull()
      expect(newState.board[0][1].isError).toBe(false)
    })
  })

  describe('COMPLETE_GAME action', () => {
    it('should set isComplete to true', () => {
      const action: GameAction = { type: 'COMPLETE_GAME' }
      
      const newState = gameReducer(initialGameState, action)
      
      expect(newState.isComplete).toBe(true)
    })
  })
})
