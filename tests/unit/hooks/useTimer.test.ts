import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '@/hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should start with time 0', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(false, onTick))
      
      expect(result.current.time).toBe(0)
    })

    it('should increment time when running', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(true, onTick))
      
      expect(result.current.time).toBe(0)
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(1)
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(2)
    })

    it('should not increment when stopped', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(false, onTick))
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      expect(onTick).not.toHaveBeenCalled()
    })
  })

  describe('controls', () => {
    it('should start timer', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(false, onTick))
      
      act(() => {
        result.current.start()
      })
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(1)
    })

    it('should stop timer', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(true, onTick))
      
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(2)
      
      act(() => {
        result.current.stop()
      })
      
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(2)
    })

    it('should reset timer to 0', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(true, onTick))
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.time).toBe(0)
    })

    it('should set time to specific value', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(false, onTick))
      
      act(() => {
        result.current.setTime(100)
      })
      
      expect(result.current.time).toBe(100)
    })
  })

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const onTick = vi.fn()
      const { unmount } = renderHook(() => useTimer(true, onTick))
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(1)
      
      unmount()
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid start/stop', () => {
      const onTick = vi.fn()
      const { result } = renderHook(() => useTimer(false, onTick))
      
      act(() => {
        result.current.start()
        result.current.stop()
        result.current.start()
        result.current.stop()
      })
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(0)
    })
  })

  describe('isRunning parameter', () => {
    it('should start when isRunning changes to true', () => {
      const onTick = vi.fn()
      const { result, rerender } = renderHook(
        ({ isRunning }: { isRunning: boolean }) => useTimer(isRunning, onTick),
        { initialProps: { isRunning: false } }
      )
      
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      
      expect(onTick).not.toHaveBeenCalled()
      
      rerender({ isRunning: true })
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(1)
    })

    it('should stop when isRunning changes to false', () => {
      const onTick = vi.fn()
      const { rerender } = renderHook(
        ({ isRunning }: { isRunning: boolean }) => useTimer(isRunning, onTick),
        { initialProps: { isRunning: true } }
      )
      
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(2)
      
      rerender({ isRunning: false })
      
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      
      expect(onTick).toHaveBeenCalledTimes(2)
    })
  })
})
