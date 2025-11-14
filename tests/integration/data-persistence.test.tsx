import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'

describe('Data Persistence Integration Tests (US5)', () => {
  const STORAGE_KEY = 'TestUser-todos' // generateStorageKey('TestUser')の結果

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('localStorage保存・復元の受入シナリオ', () => {
    it('AS-005: タスク追加後にlocalStorageに保存される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: '永続化テスト' } })
      fireEvent.click(addButton)

      // タスクが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('永続化テスト')).toBeInTheDocument()
      })

      // localStorageに保存されていることを確認
      const savedData = localStorage.getItem(STORAGE_KEY)
      expect(savedData).toBeTruthy()

      const todos = JSON.parse(savedData!)
      expect(todos).toHaveLength(1)
      expect(todos[0].text).toBe('永続化テスト')
    })

    it('AS-005: ページリロード後もタスクが保持される', async () => {
      // 最初のレンダリング: タスクを追加
      const { unmount } = render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      fireEvent.change(input, { target: { value: 'リロードテスト' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('リロードテスト')).toBeInTheDocument()
      })

      // コンポーネントをアンマウント（ページリロードをシミュレート）
      unmount()

      // 再度レンダリング
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      // タスクが復元されていることを確認
      await waitFor(() => {
        expect(screen.getByText('リロードテスト')).toBeInTheDocument()
      })
    })

    it('AS-005: 完了状態もlocalStorageに保存される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: '完了状態テスト' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('完了状態テスト')).toBeInTheDocument()
      })

      // 完了状態に変更
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })

      // localStorageに完了状態が保存されていることを確認
      const savedData = localStorage.getItem(STORAGE_KEY)
      const todos = JSON.parse(savedData!)
      expect(todos[0].completed).toBe(true)
    })
  })

  describe('データ独立性のテスト', () => {
    it('AS-006: 開発者ごとに独立したStorageKeyでデータが保存される', async () => {
      // TestUserのデータを保存
      const testUserTodos = [
        {
          id: 1,
          text: 'TestUserのタスク',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem('TestUser-todos', JSON.stringify(testUserTodos))

      // 別の開発者のデータも保存（仮想）
      const otherUserTodos = [
        {
          id: 2,
          text: '別の開発者のタスク',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem('OtherUser-todos', JSON.stringify(otherUserTodos))

      // TestUserTodoをレンダリング
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      // TestUserのタスクのみが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('TestUserのタスク')).toBeInTheDocument()
      })
      expect(screen.queryByText('別の開発者のタスク')).not.toBeInTheDocument()
    })
  })
})
