/**
 * Todoアプリケーション 型定義
 * 
 * @module types/todo
 * @version 1.0.0
 */

/**
 * タスクアイテムを表すインターフェース
 */
export interface TodoItem {
  /** ユニークな識別子（Date.now()で生成） */
  id: number
  
  /** タスクの内容（1-500文字） */
  text: string
  
  /** 完了状態フラグ */
  completed: boolean
  
  /** 作成日時（ISO 8601形式） */
  createdAt: string
}

/**
 * タスクフィルターの種類
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * localStorageキーの型
 * 形式: {開発者名}-todos
 */
export type StorageKey = `${string}-todos`

/**
 * TodoItemの型ガード関数
 * 
 * @param item - 検証対象のオブジェクト
 * @returns itemがTodoItem型として有効な場合true
 */
export function validateTodoItem(item: any): item is TodoItem {
  if (typeof item !== 'object' || item === null) return false;
  
  const todo = item as Record<string, unknown>;
  
  // id: 正の整数
  if (typeof todo.id !== 'number' || !Number.isInteger(todo.id) || todo.id <= 0) {
    return false;
  }
  
  // text: 1〜500文字（trim後）
  if (typeof todo.text !== 'string' || todo.text.trim().length === 0) {
    return false;
  }
  if (todo.text.length > 500) {
    return false;
  }
  
  // completed: boolean
  if (typeof todo.completed !== 'boolean') {
    return false;
  }
  
  // createdAt: ISO 8601形式の文字列
  if (typeof todo.createdAt !== 'string') {
    return false;
  }
  const date = new Date(todo.createdAt);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  return true;
}

/**
 * タスクをフィルタリングする関数
 * パフォーマンス: O(n)、1000タスクで200ms以内
 * 
 * @param todos - フィルタリング対象のタスク配列
 * @param filter - フィルター種類
 * @returns フィルタリングされたタスク配列
 */
export function filterTodos(todos: TodoItem[], filter: FilterType): TodoItem[] {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed)
    case 'completed':
      return todos.filter(todo => todo.completed)
    case 'all':
    default:
      return todos
  }
}

/**
 * 開発者名からStorageKeyを生成する関数
 * 日本語を含む任意の文字列をサポート
 * 
 * @param developerName - 開発者名（日本語可）
 * @returns 生成されたStorageKey
 * @throws {Error} 無効な開発者名の場合
 */
export function generateStorageKey(developerName: string): StorageKey {
  const trimmed = developerName.trim()
  
  if (!trimmed) {
    throw new Error('Invalid developer name: must not be empty')
  }
  
  // 日本語を含むすべての文字をそのまま使用
  // スペースはハイフンに変換
  const normalized = trimmed.replace(/\s+/g, '-')
  
  return `${normalized}-todos` as StorageKey
}

/**
 * タスクの統計情報を計算する関数
 * 
 * @param todos - タスク配列
 * @returns 統計情報オブジェクト
 */
export function calculateTodoStats(todos: TodoItem[]): {
  total: number
  active: number
  completed: number
} {
  return {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }
}
