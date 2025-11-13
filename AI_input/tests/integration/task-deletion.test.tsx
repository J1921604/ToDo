import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'

describe('Task Deletion Integration Tests (US3)', () => {
  const STORAGE_KEY = 'testuser-todos'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('個別削除の受入シナリオ', () => {
    it('AS-004: 削除ボタンでタスクが削除される', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 2つのタスクを追加
      fireEvent.change(input, { target: { value: '削除対象タスク' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '残すタスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('削除対象タスク')).toBeInTheDocument()
        expect(screen.getByText('残すタスク')).toBeInTheDocument()
      })

      // 削除ボタン（🗑️）をクリック
      const deleteButtons = screen.getAllByRole('button', { name: /🗑️/ })
      fireEvent.click(deleteButtons[0])

      // 削除対象タスクが表示されなくなり、残すタスクは残る
      await waitFor(() => {
        expect(screen.queryByText('削除対象タスク')).not.toBeInTheDocument()
        expect(screen.getByText('残すタスク')).toBeInTheDocument()
      })
    })

    it('AS-004: 完了状態のタスクも削除できる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // タスクを追加
      fireEvent.change(input, { target: { value: '完了後削除タスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('完了後削除タスク')).toBeInTheDocument()
      })

      // 完了状態にする
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })

      // 個別削除ボタンをクリック（複数ある場合は最初のもの）
      const deleteButtons = screen.getAllByRole('button', { name: /🗑️/ })
      // 最初のボタンは個別削除ボタン（タスクアイテム内）
      fireEvent.click(deleteButtons[0])

      // タスクが削除される
      await waitFor(() => {
        expect(screen.queryByText('完了後削除タスク')).not.toBeInTheDocument()
      })
    })

    it('AS-004: フィルター表示中に削除してもフィルター状態が維持される', async () => {
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
      fireEvent.change(input, { target: { value: '未完了タスク2' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: '完了タスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(3)
      })

      // 1つを完了状態にする
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[2])

      // 「進行中」フィルターに切り替え
      const activeButton = screen.getByRole('button', { name: /進行中/ })
      fireEvent.click(activeButton)

      await waitFor(() => {
        expect(screen.getByText('未完了タスク1')).toBeInTheDocument()
        expect(screen.getByText('未完了タスク2')).toBeInTheDocument()
        expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
      })

      // 未完了タスク1を削除
      const deleteButtons = screen.getAllByRole('button', { name: /🗑️/ })
      fireEvent.click(deleteButtons[0])

      // フィルターは「進行中」のまま、未完了タスク2のみ表示
      await waitFor(() => {
        expect(screen.queryByText('未完了タスク1')).not.toBeInTheDocument()
        expect(screen.getByText('未完了タスク2')).toBeInTheDocument()
        expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
      })
    })
  })
})
