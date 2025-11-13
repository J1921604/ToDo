import { describe, test, expect } from 'vitest'
import { 
  validateTodoItem, 
  filterTodos, 
  generateStorageKey,
  calculateTodoStats,
  type TodoItem,
  type FilterType
} from '../../../src/types/todo'

describe('validateTodoItem', () => {
  test('有効なTodoItemを正しく検証', () => {
    const valid: TodoItem = {
      id: 1,
      text: 'テストタスク',
      completed: false,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(valid)).toBe(true)
  })
  
  test('無効なID（負の数）を拒否', () => {
    const invalid = {
      id: -1,
      text: 'テスト',
      completed: false,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('無効なID（ゼロ）を拒否', () => {
    const invalid = {
      id: 0,
      text: 'テスト',
      completed: false,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('空のテキストを拒否', () => {
    const invalid = {
      id: 1,
      text: '',
      completed: false,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('500文字を超えるテキストを拒否', () => {
    const invalid = {
      id: 1,
      text: 'a'.repeat(501),
      completed: false,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('無効なcompleted型を拒否', () => {
    const invalid = {
      id: 1,
      text: 'テスト',
      completed: 'false' as any,
      createdAt: new Date().toISOString()
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('無効なcreatedAt型を拒否', () => {
    const invalid = {
      id: 1,
      text: 'テスト',
      completed: false,
      createdAt: 'invalid-date' as any
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
  
  test('無効なDate(NaN)を拒否', () => {
    const invalid = {
      id: 1,
      text: 'テスト',
      completed: false,
      createdAt: 'Invalid Date String'
    }
    expect(validateTodoItem(invalid)).toBe(false)
  })
})

describe('filterTodos', () => {
  const todos: TodoItem[] = [
    { id: 1, text: 'タスク1', completed: false, createdAt: new Date().toISOString() },
    { id: 2, text: 'タスク2', completed: true, createdAt: new Date().toISOString() },
    { id: 3, text: 'タスク3', completed: false, createdAt: new Date().toISOString() },
    { id: 4, text: 'タスク4', completed: true, createdAt: new Date().toISOString() }
  ]
  
  test('allフィルターはすべてのタスクを返す', () => {
    const filtered = filterTodos(todos, 'all')
    expect(filtered).toHaveLength(4)
    expect(filtered).toEqual(todos)
  })
  
  test('activeフィルターは未完了タスクのみ返す', () => {
    const filtered = filterTodos(todos, 'active')
    expect(filtered).toHaveLength(2)
    expect(filtered.every(t => !t.completed)).toBe(true)
  })
  
  test('completedフィルターは完了タスクのみ返す', () => {
    const filtered = filterTodos(todos, 'completed')
    expect(filtered).toHaveLength(2)
    expect(filtered.every(t => t.completed)).toBe(true)
  })
})

describe('generateStorageKey', () => {
  test('有効な開発者名からStorageKeyを生成', () => {
    expect(generateStorageKey('tanaka')).toBe('tanaka-todos')
    expect(generateStorageKey('Suzuki')).toBe('Suzuki-todos')
    expect(generateStorageKey('developer-123')).toBe('developer-123-todos')
  })
  
  test('無効な文字を含む開発者名をサニタイズ', () => {
    // 日本語文字をそのまま保持
    expect(generateStorageKey('田中')).toBe('田中-todos')
    expect(generateStorageKey('浜崎秀寿')).toBe('浜崎秀寿-todos')
    // スペースはハイフンに変換
    expect(generateStorageKey('浜崎 秀寿')).toBe('浜崎-秀寿-todos')
    expect(generateStorageKey('Name With Spaces')).toBe('Name-With-Spaces-todos')
    expect(generateStorageKey('user@example')).toBe('user@example-todos')
    expect(generateStorageKey('Test@User#123$')).toBe('Test@User#123$-todos')
  })
  
  test('完全に無効な開発者名でエラーをスロー', () => {
    expect(() => generateStorageKey('')).toThrow('Invalid developer name')
    expect(() => generateStorageKey('   ')).toThrow('Invalid developer name')
  })
})

describe('calculateTodoStats', () => {
  test('空の配列で正しい統計を返す', () => {
    const stats = calculateTodoStats([])
    expect(stats).toEqual({ total: 0, active: 0, completed: 0 })
  })
  
  test('タスク混在で正しい統計を返す', () => {
    const todos: TodoItem[] = [
      { id: 1, text: 'タスク1', completed: false, createdAt: new Date().toISOString() },
      { id: 2, text: 'タスク2', completed: true, createdAt: new Date().toISOString() },
      { id: 3, text: 'タスク3', completed: false, createdAt: new Date().toISOString() }
    ]
    const stats = calculateTodoStats(todos)
    expect(stats).toEqual({ total: 3, active: 2, completed: 1 })
  })
  
  test('すべて完了タスクで正しい統計を返す', () => {
    const todos: TodoItem[] = [
      { id: 1, text: 'タスク1', completed: true, createdAt: new Date().toISOString() },
      { id: 2, text: 'タスク2', completed: true, createdAt: new Date().toISOString() }
    ]
    const stats = calculateTodoStats(todos)
    expect(stats).toEqual({ total: 2, active: 0, completed: 2 })
  })
})
