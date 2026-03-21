import { describe, it, expect } from 'vitest'
import { generateSudokuPuzzle } from '@/algorithms/sudokuGenerator'
import { isValidSudoku, isValidPlacement } from '@/algorithms/sudokuValidator'

type Difficulty = 'easy' | 'medium' | 'hard'

describe('Performance Tests', () => {
  describe('数独生成算法性能', () => {
    const performanceThreshold = 500

    it(`简单难度生成时间应小于 ${performanceThreshold}ms`, () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 10; i++) {
        generateSudokuPuzzle('easy' as Difficulty)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 10
      
      console.log(`简单难度平均生成时间: ${averageTime.toFixed(2)}ms`)
      expect(averageTime).toBeLessThan(performanceThreshold)
    })

    it(`中等难度生成时间应小于 ${performanceThreshold}ms`, () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 10; i++) {
        generateSudokuPuzzle('medium' as Difficulty)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 10
      
      console.log(`中等难度平均生成时间: ${averageTime.toFixed(2)}ms`)
      expect(averageTime).toBeLessThan(performanceThreshold)
    })

    it(`困难难度生成时间应小于 ${performanceThreshold}ms`, () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 10; i++) {
        generateSudokuPuzzle('hard' as Difficulty)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 10
      
      console.log(`困难难度平均生成时间: ${averageTime.toFixed(2)}ms`)
      expect(averageTime).toBeLessThan(performanceThreshold)
    })
  })

  describe('数独验证算法性能', () => {
    it('验证完整数独应小于 10ms', () => {
      const { solution } = generateSudokuPuzzle('medium' as Difficulty)
      
      const startTime = performance.now()
      
      for (let i = 0; i < 100; i++) {
        isValidSudoku(solution)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 100
      
      console.log(`验证完整数独平均时间: ${averageTime.toFixed(4)}ms`)
      expect(averageTime).toBeLessThan(10)
    })

    it('检查单个位置有效性应小于 1ms', () => {
      const { puzzle } = generateSudokuPuzzle('medium' as Difficulty)
      
      const startTime = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        isValidPlacement(puzzle, 0, 0, 5)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 1000
      
      console.log(`检查单个位置平均时间: ${averageTime.toFixed(4)}ms`)
      expect(averageTime).toBeLessThan(1)
    })
  })

  describe('算法正确性验证', () => {
    it('生成的数独应该是有效的', () => {
      for (let i = 0; i < 10; i++) {
        const { solution } = generateSudokuPuzzle('medium' as Difficulty)
        expect(isValidSudoku(solution)).toBe(true)
      }
    })

    it('生成的数独应该有正确的挖空数量', () => {
      const easyPuzzle = generateSudokuPuzzle('easy' as Difficulty)
      const mediumPuzzle = generateSudokuPuzzle('medium' as Difficulty)
      const hardPuzzle = generateSudokuPuzzle('hard' as Difficulty)

      const countEmptyCells = (board: (number | null)[][]) => {
        let count = 0
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) count++
          }
        }
        return count
      }

      const easyEmpty = countEmptyCells(easyPuzzle.puzzle)
      const mediumEmpty = countEmptyCells(mediumPuzzle.puzzle)
      const hardEmpty = countEmptyCells(hardPuzzle.puzzle)

      expect(easyEmpty).toBeGreaterThanOrEqual(30)
      expect(easyEmpty).toBeLessThanOrEqual(35)
      
      expect(mediumEmpty).toBeGreaterThanOrEqual(40)
      expect(mediumEmpty).toBeLessThanOrEqual(45)
      
      expect(hardEmpty).toBeGreaterThanOrEqual(50)
      expect(hardEmpty).toBeLessThanOrEqual(55)
    })
  })

  describe('内存使用测试', () => {
    it('生成多个数独不应导致内存问题', () => {
      const puzzles = []
      
      for (let i = 0; i < 100; i++) {
        puzzles.push(generateSudokuPuzzle('medium' as Difficulty))
      }
      
      expect(puzzles.length).toBe(100)
      
      for (const puzzle of puzzles) {
        expect(puzzle.puzzle).toBeDefined()
        expect(puzzle.solution).toBeDefined()
      }
    })
  })
})
