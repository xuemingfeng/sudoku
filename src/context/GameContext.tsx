import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { GameState, GameAction } from '@/types/game'
import { gameReducer, initialGameState } from './gameReducer'
import { saveGameState, loadGameState } from '@/utils/storage'

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

  useEffect(() => {
    if (!state.isComplete && state.timer > 0) {
      saveGameState(state)
    }
  }, [state])

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
