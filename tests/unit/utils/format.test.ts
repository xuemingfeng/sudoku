import { describe, it, expect } from 'vitest'
import { formatTime, formatDate, formatDifficulty } from '@/utils/format'

describe('format', () => {
  describe('formatTime', () => {
    it('should format 0 seconds as 00:00', () => {
      expect(formatTime(0)).toBe('00:00')
    })

    it('should format seconds correctly', () => {
      expect(formatTime(5)).toBe('00:05')
      expect(formatTime(30)).toBe('00:30')
      expect(formatTime(59)).toBe('00:59')
    })

    it('should format minutes correctly', () => {
      expect(formatTime(60)).toBe('01:00')
      expect(formatTime(90)).toBe('01:30')
      expect(formatTime(120)).toBe('02:00')
    })

    it('should format hours correctly', () => {
      expect(formatTime(3600)).toBe('60:00')
      expect(formatTime(3661)).toBe('61:01')
    })

    it('should pad single digits with zeros', () => {
      expect(formatTime(61)).toBe('01:01')
      expect(formatTime(305)).toBe('05:05')
    })
  })

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date(2024, 0, 15, 10, 30)
      expect(formatDate(date)).toBe('2024-01-15 10:30')
    })

    it('should format date string correctly', () => {
      const dateString = '2024-06-20T14:45:00.000Z'
      const result = formatDate(dateString)
      expect(result).toMatch(/2024-06-20/)
    })

    it('should pad single digit months and days', () => {
      const date = new Date(2024, 0, 5, 5, 5)
      expect(formatDate(date)).toBe('2024-01-05 05:05')
    })
  })

  describe('formatDifficulty', () => {
    it('should format easy difficulty', () => {
      expect(formatDifficulty('easy')).toBe('简单')
    })

    it('should format medium difficulty', () => {
      expect(formatDifficulty('medium')).toBe('中等')
    })

    it('should format hard difficulty', () => {
      expect(formatDifficulty('hard')).toBe('困难')
    })

    it('should return original value for unknown difficulty', () => {
      expect(formatDifficulty('unknown')).toBe('unknown')
    })
  })
})
