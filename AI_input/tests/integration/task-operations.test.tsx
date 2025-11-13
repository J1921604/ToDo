import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'

describe('Task Operations Integration Tests (US1)', () => {
  const STORAGE_KEY = 'testuser-todos'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('タスク追加の受入シナリオ', () => {
    it('AS-001: 空でないタスクを追加できる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを入力して追加
      fireEvent.change(input, { target: { value: 'テストタスク1' } })
      fireEvent.click(addButton)

      // タスクが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('テストタスク1')).toBeInTheDocument()
      })

      // 入力フィールドがクリアされることを確認
      expect(input).toHaveValue('')
    })

    it('AS-001: Enterキーでタスクを追加できる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)

      // タスクを入力してEnterキーを押す
      fireEvent.change(input, { target: { value: 'Enterでタスク追加' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      // タスクが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('Enterでタスク追加')).toBeInTheDocument()
      })
    })

    it('AS-001: 空文字列のタスクは追加できない', () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 初期状態でタスクがないことを確認
      const initialTasks = screen.queryAllByRole('checkbox')
      const initialCount = initialTasks.length

      // 空文字列で追加を試みる
      fireEvent.click(addButton)

      // タスクが追加されていないことを確認
      const finalTasks = screen.queryAllByRole('checkbox')
      expect(finalTasks.length).toBe(initialCount)
    })

    it('AS-001: 複数のタスクを連続して追加できる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 3つのタスクを追加
      const tasks = ['タスク1', 'タスク2', 'タスク3']
      for (const task of tasks) {
        fireEvent.change(input, { target: { value: task } })
        fireEvent.click(addButton)
      }

      // すべてのタスクが表示されることを確認
      await waitFor(() => {
        tasks.forEach((task) => {
          expect(screen.getByText(task)).toBeInTheDocument()
        })
      })

      // 3つのチェックボックスが表示されることを確認
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(3)
    })
  })

  describe('タスク完了切り替えのテスト', () => {
    it('AS-002: チェックボックスで完了状態を切り替えられる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: '完了テストタスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('完了テストタスク')).toBeInTheDocument()
      })

      const checkbox = screen.getByRole('checkbox')

      // 未完了状態を確認
      expect(checkbox).not.toBeChecked()

      // 完了状態に切り替え
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()

      // 再度クリックして未完了に戻す
      fireEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('AS-002: 完了状態のタスクにはtext-decorationが適用される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: 'スタイルテスト' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('スタイルテスト')).toBeInTheDocument()
      })

      const taskText = screen.getByText('スタイルテスト')
      const checkbox = screen.getByRole('checkbox')

      // 完了状態に切り替え
      fireEvent.click(checkbox)

      // テキストにline-throughスタイルが適用されることを確認
      await waitFor(() => {
        expect(taskText).toHaveStyle({ textDecoration: 'line-through' })
      })
    })
  })
})
