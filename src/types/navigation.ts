export type PageRoute = 'guide' | 'game' | 'success' | 'failure'

export type NavigationState = {
  currentRoute: PageRoute
  previousRoute: PageRoute | null
  isTransitioning: boolean
}

export type NavigationContextType = {
  state: NavigationState
  navigateTo: (route: PageRoute) => void
  goBack: () => void
  setTransitioning: (isTransitioning: boolean) => void
}
