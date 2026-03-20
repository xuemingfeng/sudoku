import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(
  isRunning: boolean,
  onTick: () => void
): {
  time: number
  start: () => void
  stop: () => void
  reset: () => void
  setTime: (time: number) => void
} {
  const [time, setTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTickRef = useRef(onTick)

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  const clearInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (intervalRef.current) return
    
    intervalRef.current = window.setInterval(() => {
      onTickRef.current()
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    clearInterval()
  }, [clearInterval])

  const reset = useCallback(() => {
    clearInterval()
    setTime(0)
  }, [clearInterval])

  useEffect(() => {
    if (isRunning) {
      start()
    } else {
      stop()
    }
    
    return () => clearInterval()
  }, [isRunning, start, stop, clearInterval])

  return { time, start, stop, reset, setTime }
}
