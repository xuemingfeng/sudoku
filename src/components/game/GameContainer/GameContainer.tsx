type GameContainerProps = {
  children?: React.ReactNode
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="game-container card-container safe-area-container p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  )
}
