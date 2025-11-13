import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'

describe('Task Filtering Integration Tests (US2)', () => {
  const STORAGE_KEY = 'testuser-todos'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('フィルター切り替えの受入シナリオ', () => {
    it('AS-003: 「すべて」フィルターで全タスクが表示される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 3つのタスクを追加（2つ完了、1つ未完了）
      fireEvent.change(input, { target: { value: 'タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: 'タスク2' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: 'タスク3' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(3)
      })

      // 2つを完了状態にする
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])
      fireEvent.click(checkboxes[1])

      // 「すべて」フィルターをクリック（デフォルトで選択済み）
      const allButton = screen.getByRole('button', { name: /すべて/ })
      fireEvent.click(allButton)

      // 3つのタスクすべてが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('タスク1')).toBeInTheDocument()
        expect(screen.getByText('タスク2')).toBeInTheDocument()
        expect(screen.getByText('タスク3')).toBeInTheDocument()
      })
    })

    it('AS-003: 「進行中」フィルターで未完了タスクのみ表示される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 3つのタスクを追加
      fireEvent.change(input, { target: { value: '未完了タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了予定タスク' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '未完了タスク2' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(3)
      })

      // 1つを完了状態にする
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])

      // 「進行中」フィルターをクリック
      const activeButton = screen.getByRole('button', { name: /進行中/ })
      fireEvent.click(activeButton)

      // 未完了タスクのみ表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('未完了タスク1')).toBeInTheDocument()
        expect(screen.getByText('未完了タスク2')).toBeInTheDocument()
        expect(screen.queryByText('完了予定タスク')).not.toBeInTheDocument()
      })
    })

    it('AS-003: 「完了済み」フィルターで完了タスクのみ表示される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 3つのタスクを追加
      fireEvent.change(input, { target: { value: '未完了タスク' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了タスク2' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(3)
      })

      // 2つを完了状態にする
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      // 「完了済み」フィルターをクリック
      const completedButton = screen.getByRole('button', { name: /完了済み/ })
      fireEvent.click(completedButton)

      // 完了タスクのみ表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('完了タスク1')).toBeInTheDocument()
        expect(screen.getByText('完了タスク2')).toBeInTheDocument()
        expect(screen.queryByText('未完了タスク')).not.toBeInTheDocument()
      })
    })

    it('AS-003: フィルター切り替え後にタスク追加すると、適切なフィルターで表示される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 「進行中」フィルターに切り替え
      const activeButton = screen.getByRole('button', { name: /進行中/ })
      fireEvent.click(activeButton)

      // タスクを追加（新しいタスクは未完了）
      fireEvent.change(input, { target: { value: '新しい未完了タスク' } })
      fireEvent.click(addButton)

      // 「進行中」フィルターで新しいタスクが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('新しい未完了タスク')).toBeInTheDocument()
      })

      // 「完了済み」フィルターに切り替え
      const completedButton = screen.getByRole('button', { name: /完了済み/ })
      fireEvent.click(completedButton)

      // 新しいタスクは表示されないことを確認
      expect(screen.queryByText('新しい未完了タスク')).not.toBeInTheDocument()
    })
  })
})
