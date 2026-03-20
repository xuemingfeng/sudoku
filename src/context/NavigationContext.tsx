import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { PageRoute, NavigationState, NavigationContextType } from '@/types/navigation'

const initialNavigationState: NavigationState = {
  currentRoute: 'guide',
  previousRoute: null,
  isTransitioning: false,
}

type NavigationAction =
  | { type: 'NAVIGATE'; payload: PageRoute }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'GO_BACK' }

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'NAVIGATE':
      if (state.currentRoute === action.payload) {
        return state
      }
      return {
        ...state,
        previousRoute: state.currentRoute,
        currentRoute: action.payload,
        isTransitioning: true,
      }
    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
      }
    case 'GO_BACK':
      if (!state.previousRoute) {
        return state
      }
      return {
        ...state,
        previousRoute: state.currentRoute,
        currentRoute: state.previousRoute,
        isTransitioning: true,
      }
    default:
      return state
  }
}

const NavigationContext = createContext<NavigationContextType | null>(null)

type NavigationProviderProps = {
  children: ReactNode
  initialRoute?: PageRoute
}

export function NavigationProvider({ children, initialRoute }: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialNavigationState,
    currentRoute: initialRoute || initialNavigationState.currentRoute,
  })

  const navigateTo = useCallback((route: PageRoute) => {
    dispatch({ type: 'NAVIGATE', payload: route })
  }, [])

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const setTransitioning = useCallback((isTransitioning: boolean) => {
    dispatch({ type: 'SET_TRANSITIONING', payload: isTransitioning })
  }, [])

  return (
    <NavigationContext.Provider value={{ state, navigateTo, goBack, setTransitioning }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

export { NavigationContext }
