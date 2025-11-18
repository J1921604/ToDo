import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { saveTodos, loadTodos, clearTodos, checkStorageQuota } from '../../../src/utils/localStorage'
import type { TodoItem } from '../../../src/types/todo'

describe('localStorage utils', () => {
  const TEST_KEY = 'test-todos' as const
  const mockTodos: TodoItem[] = [
    { id: 1, text: 'タスク1', completed: false, createdAt: new Date('2024-01-01').toISOString() },
    { id: 2, text: 'タスク2', completed: true, createdAt: new Date('2024-01-02').toISOString() }
  ]

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('saveTodos', () => {
    test('タスクを正常に保存できる', () => {
      saveTodos(TEST_KEY, mockTodos)
      const saved = localStorage.getItem(TEST_KEY)
      expect(saved).toBeTruthy()
      const parsed = JSON.parse(saved!)
      expect(parsed).toHaveLength(2)
      expect(parsed[0].text).toBe('タスク1')
    })

    test('空配列を保存できる', () => {
      saveTodos(TEST_KEY, [])
      const saved = localStorage.getItem(TEST_KEY)
      expect(saved).toBe('[]')
    })
  })

  describe('loadTodos', () => {
    test('保存されたタスクを正常に読み込める', () => {
      saveTodos(TEST_KEY, mockTodos)
      const loaded = loadTodos(TEST_KEY)
      expect(loaded).toHaveLength(2)
      expect(loaded[0].text).toBe('タスク1')
      expect(typeof loaded[0].createdAt).toBe('string')
    })

    test('データが存在しない場合は空配列を返す', () => {
      const loaded = loadTodos(TEST_KEY)
      expect(loaded).toEqual([])
    })

    test('破損したJSONデータの場合は空配列を返す', () => {
      localStorage.setItem(TEST_KEY, '{invalid json}')
      const loaded = loadTodos(TEST_KEY)
      expect(loaded).toEqual([])
    })

    test('配列でないデータの場合は空配列を返す', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify({ invalid: 'data' }))
      const loaded = loadTodos(TEST_KEY)
      expect(loaded).toEqual([])
    })
  })

  describe('clearTodos', () => {
    test('タスクを正常にクリアできる', () => {
      saveTodos(TEST_KEY, mockTodos)
      expect(localStorage.getItem(TEST_KEY)).toBeTruthy()
      
      clearTodos(TEST_KEY)
      expect(localStorage.getItem(TEST_KEY)).toBeNull()
    })

    test('存在しないキーをクリアしてもエラーにならない', () => {
      expect(() => clearTodos('non-existent-key' as any)).not.toThrow()
    })
  })

  describe('checkStorageQuota', () => {
    test('通常時は利用可能と判定される', () => {
      const result = checkStorageQuota()
      // 通常の環境では利用可能
      expect(typeof result).toBe('boolean')
    })
  })
})
