import React, { useState, useEffect } from 'react'
import { Input } from '../components/atoms/Input'
import { Button } from '../components/atoms/Button'

interface TodoItem {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type FilterType = 'all' | 'active' | 'completed'

// TODO: ここに自分の名前を入力してください（例: TanakaPage, SuzukiPage）
export const YourNamePage: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  // TODO: ここに自分の名前を入力してください（例: tanaka-todos, suzuki-todos）
  const STORAGE_KEY = 'your-name-todos'

  // localStorageからデータを読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY)
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        setTodos(
          parsedTodos.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }))
        )
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error)
      }
    }
  }, [])

  // localStorageに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // 新しいタスクを追加
  const addTodo = () => {
    if (!inputText.trim()) return

    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
    }

    setTodos((prev) => [...prev, newTodo])
    setInputText('')
  }

  // 完了状態を切り替え
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // タスクをフィルタリング
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  // 統計
  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.filter((todo) => todo.completed).length

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* TODO: ここに自分の名前を入力してください（例: 田中のタスク管理、鈴木のタスク管理） */}
      <h1>📝 【あなたの名前】のタスク管理</h1>

      {/* タスク追加エリア */}
      <div
        style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
        onKeyDown={handleKeyPress}
      >
        <div style={{ flex: 1 }}>
          <Input.Text
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            placeholder="新しいタスクを入力... (Enterで追加)"
          />
        </div>
        <Button.Middle onClick={addTodo}>➕ 追加</Button.Middle>
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
        <div
          style={{
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            borderRadius: '4px',
          }}
        >
          <Button.Small onClick={() => setFilter('all')}>
            すべて ({todos.length})
          </Button.Small>
        </div>
        <div
          style={{
            backgroundColor: filter === 'active' ? '#007bff' : '#f8f9fa',
            borderRadius: '4px',
          }}
        >
          <Button.Small onClick={() => setFilter('active')}>
            進行中 ({activeCount})
          </Button.Small>
        </div>
        <div
          style={{
            backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
            borderRadius: '4px',
          }}
        >
          <Button.Small onClick={() => setFilter('completed')}>
            完了済み ({completedCount})
          </Button.Small>
        </div>
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
                  {todo.createdAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 下部統計 */}
      {todos.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666' }}>
            合計 {todos.length} 個のタスク、{activeCount} 個が未完了
          </span>
        </div>
      )}
    </div>
  )
}

export default YourNamePage
