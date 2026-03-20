import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberButton } from '@/components/game/NumberPad/NumberButton'

describe('NumberButton', () => {
  it('should display number', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={9}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should display remaining count', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={7}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('should be disabled when isDisabled is true', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not be disabled when isDisabled is false', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={9}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('should call onClick with number', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={7}
        remainingCount={9}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onClick).toHaveBeenCalledWith(7)
  })

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should have correct aria-label', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={7}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', '数字 5，剩余 7 个')
  })

  it('should have aria-disabled when disabled', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('should apply disabled styles when disabled', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={true}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-slate-100')
    expect(button).toHaveClass('text-slate-300')
  })

  it('should apply active styles when not disabled', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={9}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-50')
    expect(button).toHaveClass('text-blue-600')
  })

  it('should handle all numbers 1-9', () => {
    const onClick = vi.fn()
    
    for (let num = 1; num <= 9; num++) {
      const { unmount } = render(
        <NumberButton
          number={num}
          remainingCount={9}
          isDisabled={false}
          onClick={onClick}
        />
      )
      
      const button = screen.getByRole('button', { name: new RegExp(`数字 ${num}`) })
      expect(button).toBeInTheDocument()
      unmount()
    }
  })

  it('should handle remaining count 0', () => {
    const onClick = vi.fn()
    
    render(
      <NumberButton
        number={5}
        remainingCount={0}
        isDisabled={false}
        onClick={onClick}
      />
    )
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
