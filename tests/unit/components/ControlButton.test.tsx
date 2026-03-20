import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ControlButton } from '@/components/game/ControlPanel/ControlButton'

describe('ControlButton', () => {
  it('should display icon and label', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
      />
    )
    
    expect(screen.getByText('开始')).toBeInTheDocument()
    const icon = document.querySelector('.ri-play-line')
    expect(icon).toBeInTheDocument()
  })

  it('should apply correct color class - blue', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('should apply correct color class - slate', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-refresh-line"
        label="重置"
        color="slate"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-slate-600')
  })

  it('should apply correct color class - amber', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-lightbulb-line"
        label="提示"
        color="amber"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-amber-500')
  })

  it('should apply correct color class - green', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-check-line"
        label="检查"
        color="green"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-green-600')
  })

  it('should apply correct color class - red', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-close-line"
        label="结束"
        color="red"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600')
  })

  it('should be disabled when disabled prop is true', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
        disabled={true}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not be disabled when disabled prop is false', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
        disabled={false}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('should call onClick', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
        disabled={true}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should have correct aria-label', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始游戏"
        color="blue"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', '开始游戏')
  })

  it('should apply disabled styles when disabled', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
        disabled={true}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('opacity-50')
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('should have white text', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-white')
  })

  it('should have rounded corners', () => {
    const onClick = vi.fn()
    
    render(
      <ControlButton
        icon="ri-play-line"
        label="开始"
        color="blue"
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-xl')
  })
})
