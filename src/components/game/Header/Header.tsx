type HeaderProps = {
  title?: string
  timer?: string
  errors?: string
  difficulty?: string
}

export function Header({ 
  title = '数独游戏',
  timer = '00:00',
  errors = '0/3',
  difficulty = '中等'
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <i className="ri-game-line text-3xl text-blue-600" />
        <span className="ml-3 text-3xl font-bold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center">
          <i className="ri-time-line text-xl text-slate-500" />
          <span className="ml-2 text-xl font-semibold text-slate-700">{timer}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-close-circle-line text-xl text-red-500" />
          <span className="ml-2 text-xl font-semibold text-red-500">{errors}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-bar-chart-line text-xl text-purple-600" />
          <span className="ml-2 text-xl font-semibold text-purple-600">{difficulty}</span>
        </div>
      </div>
    </div>
  )
}
