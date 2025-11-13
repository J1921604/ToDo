import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'

describe('Bulk Deletion Integration Tests (US4)', () => {
  const STORAGE_KEY = 'testuser-todos'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('一括削除の受入シナリオ', () => {
    it('AS-007: 「完了タスクをクリア」ボタンで完了タスクが一括削除される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 4つのタスクを追加
      fireEvent.change(input, { target: { value: '未完了タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '未完了タスク2' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了タスク2' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(4)
      })

      // 2つを完了状態にする
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[3])

      await waitFor(() => {
        expect(checkboxes[1]).toBeChecked()
        expect(checkboxes[3]).toBeChecked()
      })

      // 「完了タスクをクリア」ボタンをクリック
      const clearButton = screen.getByRole('button', { name: /完了タスクをクリア/ })
      fireEvent.click(clearButton)

      // 完了タスクが削除され、未完了タスクのみ残る
      await waitFor(() => {
        expect(screen.getByText('未完了タスク1')).toBeInTheDocument()
        expect(screen.getByText('未完了タスク2')).toBeInTheDocument()
        expect(screen.queryByText('完了タスク1')).not.toBeInTheDocument()
        expect(screen.queryByText('完了タスク2')).not.toBeInTheDocument()
      })

      // 残りのチェックボックスは2つ
      expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    })

    it('AS-007: 完了タスクがない場合、クリアボタンは表示されない', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 未完了タスクを追加
      fireEvent.change(input, { target: { value: '未完了タスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('未完了タスク')).toBeInTheDocument()
      })

      // 「完了タスクをクリア」ボタンは表示されない
      const clearButton = screen.queryByRole('button', { name: /完了タスクをクリア/ })
      expect(clearButton).not.toBeInTheDocument()
    })

    it('AS-007: 完了タスクを作成するとクリアボタンが表示される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: '完了予定タスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('完了予定タスク')).toBeInTheDocument()
      })

      // 初期状態ではクリアボタンは表示されない
      expect(screen.queryByRole('button', { name: /完了タスクをクリア/ })).not.toBeInTheDocument()

      // タスクを完了状態にする
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })

      // クリアボタンが表示される
      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /完了タスクをクリア/ })
        expect(clearButton).toBeInTheDocument()
        expect(clearButton).toHaveTextContent(/1/)
      })
    })
  })
})
