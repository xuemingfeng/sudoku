type GameContainerProps = {
  children?: React.ReactNode
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="card-container w-full max-w-[800px]">
      {children}
    </div>
  )
}
