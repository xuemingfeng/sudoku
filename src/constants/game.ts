export const GRID_SIZE = 9
export const BOX_SIZE = 3
export const MAX_ERRORS = 3
export const AUTO_SAVE_DELAY = 500

export const DIFFICULTY_CONFIG = {
  easy: { minHoles: 30, maxHoles: 35, label: '简单' },
  medium: { minHoles: 40, maxHoles: 45, label: '中等' },
  hard: { minHoles: 50, maxHoles: 55, label: '困难' },
} as const

export const STORAGE_KEYS = {
  GAME_STATE: 'sudoku_game_state',
  GUIDE_SHOWN: 'sudoku_guide_shown',
  BEST_RECORDS: 'sudoku_best_records',
  GAME_HISTORY: 'sudoku_game_history',
} as const
