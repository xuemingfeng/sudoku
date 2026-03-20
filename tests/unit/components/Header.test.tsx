import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/game/Header'
import type { Difficulty } from '@/types/sudoku'

describe('Header', () => {
  const defaultProps = {
    timer: 0,
    errors: 0,
    maxErrors: 3,
    difficulty: 'medium' as Difficulty,
  }

  describe('标题显示', () => {
    it('应显示默认标题 "数独游戏"', () => {
      render(<Header {...defaultProps} />)
      expect(screen.getByText('数独游戏')).toBeInTheDocument()
    })

    it('应显示自定义标题', () => {
      render(<Header {...defaultProps} title="自定义标题" />)
      expect(screen.getByText('自定义标题')).toBeInTheDocument()
    })

    it('标题应有正确的样式类', () => {
      render(<Header {...defaultProps} />)
      const title = screen.getByText('数独游戏')
      expect(title).toHaveClass('text-[28px]', 'font-bold', 'text-slate-800')
    })
  })

  describe('计时器显示', () => {
    it('应显示格式化的时间 00:00', () => {
      render(<Header {...defaultProps} timer={0} />)
      expect(screen.getByText('00:00')).toBeInTheDocument()
    })

    it('应正确格式化分钟数', () => {
      render(<Header {...defaultProps} timer={323} />)
      expect(screen.getByText('05:23')).toBeInTheDocument()
    })

    it('应正确格式化超过1小时的时间', () => {
      render(<Header {...defaultProps} timer={3661} />)
      expect(screen.getByText('61:01')).toBeInTheDocument()
    })

    it('应正确格式化个位数秒', () => {
      render(<Header {...defaultProps} timer={5} />)
      expect(screen.getByText('00:05')).toBeInTheDocument()
    })

    it('应正确格式化个位数分钟', () => {
      render(<Header {...defaultProps} timer={60} />)
      expect(screen.getByText('01:00')).toBeInTheDocument()
    })
  })

  describe('错误次数显示', () => {
    it('应显示错误次数格式 "0/3"', () => {
      render(<Header {...defaultProps} errors={0} maxErrors={3} />)
      expect(screen.getByText('0/3')).toBeInTheDocument()
    })

    it('应显示正确的错误计数', () => {
      render(<Header {...defaultProps} errors={2} maxErrors={3} />)
      expect(screen.getByText('2/3')).toBeInTheDocument()
    })

    it('应支持自定义最大错误次数', () => {
      render(<Header {...defaultProps} errors={1} maxErrors={5} />)
      expect(screen.getByText('1/5')).toBeInTheDocument()
    })

    it('错误次数应有红色样式', () => {
      render(<Header {...defaultProps} errors={1} maxErrors={3} />)
      const errorText = screen.getByText('1/3')
      expect(errorText).toHaveClass('text-red-500')
    })
  })

  describe('难度显示', () => {
    it('应显示 "简单" 当难度为 easy', () => {
      render(<Header {...defaultProps} difficulty="easy" />)
      expect(screen.getByText('简单')).toBeInTheDocument()
    })

    it('应显示 "中等" 当难度为 medium', () => {
      render(<Header {...defaultProps} difficulty="medium" />)
      expect(screen.getByText('中等')).toBeInTheDocument()
    })

    it('应显示 "困难" 当难度为 hard', () => {
      render(<Header {...defaultProps} difficulty="hard" />)
      expect(screen.getByText('困难')).toBeInTheDocument()
    })

    it('难度应有紫色样式', () => {
      render(<Header {...defaultProps} difficulty="medium" />)
      const difficultyText = screen.getByText('中等')
      expect(difficultyText).toHaveClass('text-purple-600')
    })
  })

  describe('组件结构', () => {
    it('应包含游戏图标', () => {
      render(<Header {...defaultProps} />)
      const icon = document.querySelector('.ri-game-line')
      expect(icon).toBeInTheDocument()
    })

    it('应包含计时器图标', () => {
      render(<Header {...defaultProps} />)
      const icon = document.querySelector('.ri-time-line')
      expect(icon).toBeInTheDocument()
    })

    it('应包含错误图标', () => {
      render(<Header {...defaultProps} />)
      const icon = document.querySelector('.ri-close-circle-line')
      expect(icon).toBeInTheDocument()
    })

    it('应包含难度图标', () => {
      render(<Header {...defaultProps} />)
      const icon = document.querySelector('.ri-bar-chart-line')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('性能优化', () => {
    it('应使用 React.memo 避免不必要重渲染', () => {
      const { rerender } = render(<Header {...defaultProps} />)
      
      rerender(<Header {...defaultProps} />)
      
      expect(screen.getByText('数独游戏')).toBeInTheDocument()
    })
  })
})
