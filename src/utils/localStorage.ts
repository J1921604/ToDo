import type { TodoItem, StorageKey } from '../types/todo'

/**
 * localStorageにタスクを保存する
 * 憲法SR-005遵守: エラー時ユーザーデータをマスキング
 * 
 * @param key - StorageKey
 * @param todos - 保存するタスク配列
 */
export function saveTodos(key: StorageKey, todos: TodoItem[]): void {
  try {
    const serialized = JSON.stringify(todos)
    localStorage.setItem(key, serialized)
  } catch (error) {
    // 憲法SR-005: 機密情報マスキング（ユーザーデータをログに出力しない）
    console.error(`Failed to save todos to localStorage (key: ${key}):`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      taskCount: todos.length
    })
  }
}

/**
 * localStorageからタスクを読み込む
 * エラーハンドリング: 破損データの場合は空配列を返す
 * 
 * @param key - StorageKey
 * @returns 読み込んだタスク配列（エラー時は空配列）
 */
export function loadTodos(key: StorageKey): TodoItem[] {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      console.warn(`Invalid data format in localStorage (key: ${key})`)
      return []
    }

    // createdAtはISO 8601文字列として保持
    return parsed
  } catch (error) {
    console.error(`Failed to load todos from localStorage (key: ${key}):`, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return []
  }
}

/**
 * localStorageからタスクをクリアする
 * 
 * @param key - StorageKey
 */
export function clearTodos(key: StorageKey): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to clear todos from localStorage (key: ${key}):`, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * localStorageの利用可能容量をチェックする
 * 憲法PR-003: メモリ使用量50MB以下
 * 
 * @returns 利用可能な場合true、quota超過の場合false
 */
export function checkStorageQuota(): boolean {
  try {
    const testKey = '__test_quota__'
    const testValue = 'x'.repeat(1024 * 1024) // 1MB
    localStorage.setItem(testKey, testValue)
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.warn('localStorage quota exceeded')
    return false
  }
}
