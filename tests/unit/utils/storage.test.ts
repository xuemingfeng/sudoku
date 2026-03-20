import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveBestRecord,
  getBestRecord,
  getBestRecords,
  saveGameHistory,
  getGameHistory,
  clearGameHistory,
  isGuideShown,
  setGuideShown,
  clearAllData,
} from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/game'
import type { GameState, Difficulty } from '@/types/game'

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
})

describe('storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  describe('saveGameState', () => {
    it('should save game state to localStorage', () => {
      const state: GameState = {
        board: [],
        difficulty: 'medium',
        timer: 100,
        errors: 2,
        maxErrors: 3,
        isComplete: false,
        isPaused: false,
      }

      const result = saveGameState(state)
      expect(result).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(state)
      )
    })
  })

  describe('loadGameState', () => {
    it('should load game state from localStorage', () => {
      const state: GameState = {
        board: [],
        difficulty: 'hard',
        timer: 200,
        errors: 1,
        maxErrors: 3,
        isComplete: false,
        isPaused: true,
      }

      mockLocalStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state))
      const loaded = loadGameState()
      expect(loaded).toEqual(state)
    })

    it('should return null when no state exists', () => {
      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })
  })

  describe('clearGameState', () => {
    it('should remove game state from localStorage', () => {
      const result = clearGameState()
      expect(result).toBe(true)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.GAME_STATE)
    })
  })

  describe('saveBestRecord', () => {
    it('should save new best record', () => {
      const result = saveBestRecord('easy', 120)
      expect(result).toBe(true)
    })

    it('should update record if new time is better', () => {
      saveBestRecord('medium', 200)
      const result = saveBestRecord('medium', 150)
      expect(result).toBe(true)
      
      const record = getBestRecord('medium')
      expect(record).toBe(150)
    })

    it('should not update record if new time is worse', () => {
      saveBestRecord('hard', 300)
      const result = saveBestRecord('hard', 400)
      expect(result).toBe(false)
      
      const record = getBestRecord('hard')
      expect(record).toBe(300)
    })
  })

  describe('getBestRecord', () => {
    it('should return null when no record exists', () => {
      const record = getBestRecord('easy')
      expect(record).toBeNull()
    })

    it('should return the best record', () => {
      saveBestRecord('medium', 180)
      const record = getBestRecord('medium')
      expect(record).toBe(180)
    })
  })

  describe('getBestRecords', () => {
    it('should return all best records', () => {
      saveBestRecord('easy', 100)
      saveBestRecord('medium', 200)
      
      const records = getBestRecords()
      expect(records.easy).toBe(100)
      expect(records.medium).toBe(200)
      expect(records.hard).toBeNull()
    })
  })

  describe('saveGameHistory', () => {
    it('should save game record to history', () => {
      const record = {
        difficulty: 'easy' as Difficulty,
        time: 150,
        errors: 1,
        date: new Date().toISOString(),
        isComplete: true,
      }

      const result = saveGameHistory(record)
      expect(result).toBe(true)
      
      const history = getGameHistory()
      expect(history).toHaveLength(1)
      expect(history[0]).toEqual(record)
    })

    it('should limit history to 100 records', () => {
      for (let i = 0; i < 110; i++) {
        saveGameHistory({
          difficulty: 'easy',
          time: i,
          errors: 0,
          date: new Date().toISOString(),
          isComplete: true,
        })
      }

      const history = getGameHistory()
      expect(history.length).toBeLessThanOrEqual(100)
    })
  })

  describe('isGuideShown', () => {
    it('should return false by default', () => {
      expect(isGuideShown()).toBe(false)
    })

    it('should return true after setGuideShown', () => {
      setGuideShown()
      expect(isGuideShown()).toBe(true)
    })
  })

  describe('clearAllData', () => {
    it('should clear all storage data', () => {
      saveBestRecord('easy', 100)
      setGuideShown()
      
      const result = clearAllData()
      expect(result).toBe(true)
      
      expect(getBestRecord('easy')).toBeNull()
      expect(isGuideShown()).toBe(false)
    })
  })
})
