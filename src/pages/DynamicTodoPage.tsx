import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Text as InputText } from '../components/atoms/Input/Text'
import { Small as ButtonSmall, Middle as ButtonMiddle } from '../components/atoms/Button'
import type { TodoItem, FilterType } from '../types/todo'
import { generateStorageKey } from '../types/todo'

interface DynamicTodoPageProps {
  userName: string
}

const DynamicTodoPage: React.FC<DynamicTodoPageProps> = ({ userName }) => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [error, setError] = useState<string | null>(null)

  // 個人専用のStorageKey
  let STORAGE_KEY: string
  try {
    STORAGE_KEY = generateStorageKey(userName)
  } catch (err) {
    setError(`ストレージキーの生成に失敗しました: ${err instanceof Error ? err.message : String(err)}`)
    STORAGE_KEY = `fallback-${Date.now()}-todos`
  }

  const [isLoaded, setIsLoaded] = useState(false)

  // localStorageからデータを読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY)
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        setTodos(parsedTodos)
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [STORAGE_KEY])

  // localStorageに保存
  useEffect(() => {
    if (!isLoaded) return // 初回ロード完了まで保存しない
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
    }
  }, [todos, STORAGE_KEY, isLoaded])

  // 新しいタスクを追加
  const addTodo = useCallback(() => {
    if (!inputText.trim()) return

    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTodos((prev) => [...prev, newTodo])
    setInputText('')
  }, [inputText])

  // 完了状態を切り替え
  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  // 個別タスクを削除
  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  // 完了タスクを一括削除
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [])

  // タスクをフィルタリング（useMemoで最適化）
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case 'active':
          return !todo.completed
        case 'completed':
          return todo.completed
        default:
          return true
      }
    })
  }, [todos, filter])

  // 統計（useMemoで最適化）
  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos])
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // エラーが発生している場合はエラーメッセージを表示
  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>❌ エラーが発生しました</h1>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          border: '2px solid #c00',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#c00', fontWeight: 'bold' }}>
            {error}
          </p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            ユーザー名: <code>{userName}</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📝 {userName}のタスク管理</h1>

      {/* タスク追加エリア */}
      <div
        style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
        onKeyDown={handleKeyPress}
      >
        <InputText
          value={inputText}
          onChange={setInputText}
          placeholder="新しいタスクを入力... (Enterで追加)"
        />
        <ButtonMiddle onClick={addTodo}>➕ 追加</ButtonMiddle>
      </div>

      {/* フィルター */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <span>フィルター:</span>
        <ButtonSmall
          onClick={() => setFilter('all')}
          style={{
            backgroundColor: filter === 'all' ? '#007bff' : '#6c757d'
          }}
        >
          すべて ({todos.length})
        </ButtonSmall>
        <ButtonSmall
          onClick={() => setFilter('active')}
          style={{
            backgroundColor: filter === 'active' ? '#007bff' : '#6c757d'
          }}
        >
          進行中 ({activeCount})
        </ButtonSmall>
        <ButtonSmall
          onClick={() => setFilter('completed')}
          style={{
            backgroundColor: filter === 'completed' ? '#007bff' : '#6c757d'
          }}
        >
          完了済み ({completedCount})
        </ButtonSmall>
      </div>

      {/* タスクリスト */}
      <div>
        {filteredTodos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              border: '2px dashed #ddd',
              borderRadius: '8px',
            }}
          >
            {filter === 'all'
              ? 'まだタスクがありません。追加してみてください！'
              : filter === 'active'
              ? '進行中のタスクがありません'
              : '完了済みのタスクがありません'}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  margin: '8px 0',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: todo.completed ? '#f8f9fa' : '#fff',
                }}
              >
                {/* チェックボックス */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                />

                {/* タスクテキスト */}
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#666' : '#000',
                    fontSize: '16px',
                  }}
                >
                  {todo.text}
                </span>

                {/* 作成日時 */}
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    marginRight: '12px',
                  }}
                >
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>

                {/* 削除ボタン */}
                <ButtonSmall
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    padding: '4px 8px',
                    fontSize: '12px'
                  }}
                >
                  🗑️
                </ButtonSmall>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 下部統計と完了タスククリア */}
      {todos.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: completedCount > 0 ? '15px' : '0' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              合計 {todos.length} 個のタスク、{activeCount} 個が未完了
            </span>
          </div>
          
          {/* 完了タスクをクリアボタン */}
          {completedCount > 0 && (
            <div style={{ textAlign: 'center' }}>
              <ButtonMiddle
                onClick={clearCompleted}
                style={{
                  backgroundColor: '#ffc107',
                  color: '#000'
                }}
              >
                🗑️ 完了タスクをクリア ({completedCount})
              </ButtonMiddle>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DynamicTodoPage
