import { createContext, useContext, useReducer, useEffect, useRef, useCallback, type ReactNode } from 'react'
import type { GameState, GameAction } from '@/types/game'
import { gameReducer, initialGameState } from './gameReducer'
import { saveGameState, loadGameState } from '@/utils/storage'
import { AUTO_SAVE_DELAY } from '@/constants/game'

type GameContextType = {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | null>(null)

type GameProviderProps = {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState, (initial) => {
    const savedState = loadGameState()
    return savedState || initial
  })

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = useCallback((gameState: GameState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (!gameState.isComplete) {
        saveGameState(gameState)
      }
    }, AUTO_SAVE_DELAY)
  }, [])

  useEffect(() => {
    if (!state.isComplete) {
      debouncedSave(state)
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, debouncedSave])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext(): GameContextType {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}

export { GameContext }
