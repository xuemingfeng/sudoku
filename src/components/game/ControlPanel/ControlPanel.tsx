type ControlPanelProps = {
  onNewGame: () => void
  onReset: () => void
  onHint: () => void
  onCheck: () => void
  onEndGame: () => void
}

export function ControlPanel({
  onNewGame,
  onReset,
  onHint,
  onCheck,
  onEndGame
}: ControlPanelProps) {
  return (
    <div className="flex gap-3 w-full">
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-98 transition-all"
        onClick={onNewGame}
      >
        <i className="ri-add-line text-lg" />
        新游戏
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 active:scale-98 transition-all"
        onClick={onReset}
      >
        <i className="ri-refresh-line text-lg" />
        重置
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 active:scale-98 transition-all"
        onClick={onHint}
      >
        <i className="ri-lightbulb-line text-lg" />
        提示
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 active:scale-98 transition-all"
        onClick={onCheck}
      >
        <i className="ri-check-line text-lg" />
        检查
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-98 transition-all"
        onClick={onEndGame}
      >
        <i className="ri-close-line text-lg" />
        结束游戏
      </button>
    </div>
  )
}
