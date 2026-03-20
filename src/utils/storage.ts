import type { GameState, Difficulty } from '@/types/game'
import { STORAGE_KEYS } from '@/constants/game'

export type GameRecord = {
  difficulty: Difficulty
  time: number
  errors: number
  hints: number
  date: string
  isComplete: boolean
}

type BestRecords = Record<Difficulty, number | null>

function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function safeRemoveItem(key: string): boolean {
  if (!isStorageAvailable()) return false
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function saveGameState(state: GameState): boolean {
  return safeSetItem(STORAGE_KEYS.GAME_STATE, state)
}

export function loadGameState(): GameState | null {
  return safeGetItem<GameState | null>(STORAGE_KEYS.GAME_STATE, null)
}

export function hasSavedGame(): boolean {
  const state = loadGameState()
  if (!state) return false
  if (state.isComplete) return false
  const hasEmptyCells = state.board.some(row => 
    row.some(cell => cell.value === null)
  )
  return hasEmptyCells
}

export function clearGameState(): boolean {
  return safeRemoveItem(STORAGE_KEYS.GAME_STATE)
}

export function saveBestRecord(difficulty: Difficulty, time: number): boolean {
  const records = getBestRecords()
  const currentBest = records[difficulty]
  
  if (currentBest === null || time < currentBest) {
    records[difficulty] = time
    return safeSetItem(STORAGE_KEYS.BEST_RECORDS, records)
  }
  
  return false
}

export function getBestRecord(difficulty: Difficulty): number | null {
  const records = getBestRecords()
  return records[difficulty]
}

export function getBestRecords(): BestRecords {
  return safeGetItem<BestRecords>(STORAGE_KEYS.BEST_RECORDS, {
    easy: null,
    medium: null,
    hard: null,
  })
}

export function saveGameHistory(record: GameRecord): boolean {
  const history = getGameHistory()
  history.unshift(record)
  
  if (history.length > 100) {
    history.length = 100
  }
  
  return safeSetItem(STORAGE_KEYS.GAME_HISTORY, history)
}

export function getGameHistory(): GameRecord[] {
  return safeGetItem<GameRecord[]>(STORAGE_KEYS.GAME_HISTORY, [])
}

export function clearGameHistory(): boolean {
  return safeRemoveItem(STORAGE_KEYS.GAME_HISTORY)
}

export function isGuideShown(): boolean {
  return safeGetItem<boolean>(STORAGE_KEYS.GUIDE_SHOWN, false)
}

export function setGuideShown(): boolean {
  return safeSetItem(STORAGE_KEYS.GUIDE_SHOWN, true)
}

export function clearAllData(): boolean {
  const results = [
    clearGameState(),
    safeRemoveItem(STORAGE_KEYS.BEST_RECORDS),
    clearGameHistory(),
    safeRemoveItem(STORAGE_KEYS.GUIDE_SHOWN),
  ]
  return results.every(Boolean)
}
