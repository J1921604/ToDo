import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import type { TodoItem } from '../../../src/types/todo'
import { Small as ButtonSmall } from '../../../src/components/atoms/Button'

// TaskItemコンポーネントの定義（将来的に分離予定）
interface TaskItemProps {
  todo: TodoItem
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.text}`}
      />
      <span
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#999' : '#000',
        }}
      >
        {todo.text}
      </span>
      <span style={{ fontSize: '12px', color: '#888' }}>
        {new Date(todo.createdAt).toLocaleDateString()}
      </span>
      <ButtonSmall
        onClick={() => onDelete(todo.id)}
        style={{ backgroundColor: '#dc3545' }}
      >
        🗑️
      </ButtonSmall>
    </div>
  )
}

describe('TaskItem Component Tests (US1)', () => {
  const mockTodo: TodoItem = {
    id: 1,
    text: 'テストタスク',
    completed: false,
    createdAt: new Date('2025-11-06').toISOString(),
  }

  it('タスクテキストが正しく表示される', () => {
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    render(<TaskItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />)

    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('チェックボックスが正しい状態で表示される', () => {
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    // 未完了タスク
    const { rerender } = render(
      <TaskItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    // 完了タスク
    const completedTodo = { ...mockTodo, completed: true }
    rerender(<TaskItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} />)

    expect(checkbox).toBeChecked()
  })

  it('チェックボックスクリック時にonToggleが呼ばれる', () => {
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    render(<TaskItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockToggle).toHaveBeenCalledTimes(1)
    expect(mockToggle).toHaveBeenCalledWith(mockTodo.id)
  })

  it('完了状態のタスクにline-throughスタイルが適用される', () => {
    const mockToggle = vi.fn()
    const mockDelete = vi.fn()

    // 未完了タスク
    const { rerender } = render(
      <TaskItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    )

    let taskText = screen.getByText('テストタスク')
    expect(taskText).toHaveStyle({ textDecoration: 'none' })

    // 完了タスク
    const completedTodo = { ...mockTodo, completed: true }
    rerender(<TaskItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} />)

    taskText = screen.getByText('テストタスク')
    expect(taskText).toHaveStyle({ textDecoration: 'line-through' })
  })
})
