import { describe, test, expect } from 'vitest'
import { 
  measurePerformance, 
  measurePerformanceSync, 
  getMemoryUsage,
  checkMemoryThreshold 
} from '../../../src/utils/performance'

describe('performance utils', () => {
  describe('measurePerformance', () => {
    test('非同期関数の実行時間を計測できる', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'result'
      }

      const { result, duration, exceeded } = await measurePerformance(fn, 'Test async', 100)
      
      expect(result).toBe('result')
      expect(duration).toBeGreaterThanOrEqual(8)
      expect(exceeded).toBe(false)
    })

    test('閾値を超えた場合にexceededフラグが立つ', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 60))
        return 'slow'
      }

      const { result, duration, exceeded } = await measurePerformance(fn, 'Slow async', 50)
      
      expect(result).toBe('slow')
      expect(duration).toBeGreaterThanOrEqual(55)
      expect(exceeded).toBe(true)
    })
  })

  describe('measurePerformanceSync', () => {
    test('同期関数の実行時間を計測できる', () => {
      const fn = () => {
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }
        return sum
      }

      const { result, duration, exceeded } = measurePerformanceSync(fn, 'Test sync', 100)
      
      expect(result).toBe(499500)
      expect(duration).toBeGreaterThanOrEqual(0)
      expect(exceeded).toBe(false) // 通常は100ms未満で完了
    })

    test('閾値を超えた場合にexceededフラグが立つ', () => {
      const fn = () => {
        // 意図的に重い処理をシミュレート
        const start = Date.now()
        while (Date.now() - start < 60) {
          // 60ms待機
        }
        return 'slow'
      }

      const { result, duration, exceeded } = measurePerformanceSync(fn, 'Slow sync', 50)
      
      expect(result).toBe('slow')
      expect(duration).toBeGreaterThan(55) // タイミング誤差を考慮
      expect(exceeded).toBe(true)
    })
  })

  describe('getMemoryUsage', () => {
    test('メモリ使用量を取得できる（またはnull）', () => {
      const memory = getMemoryUsage()
      // 環境によってperformance.memoryが利用できない場合がある
      expect(memory === null || typeof memory === 'number').toBe(true)
    })
  })

  describe('checkMemoryThreshold', () => {
    test('メモリ閾値チェックがエラーなく実行できる', () => {
      // 環境によってはメモリ情報が取得できないため、エラーが発生しないことのみ確認
      expect(() => checkMemoryThreshold(50)).not.toThrow()
    })
  })
})
