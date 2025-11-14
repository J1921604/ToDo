import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TestUserTodo } from '../../src/pages/TestUserTodo'
import { generateStorageKey } from '../../src/types/todo'

describe('Edge Cases Tests', () => {
  const STORAGE_KEY = 'TestUser-todos' // generateStorageKey('TestUser')の結果

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('エッジケーステスト', () => {
    it('Edge-001: 長いタスク名（500文字）を正しく処理できる', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 500文字のタスク名
      const longTaskName = 'あ'.repeat(500)

      fireEvent.change(input, { target: { value: longTaskName } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(longTaskName)).toBeInTheDocument()
      })

      // localStorageに保存されていることを確認
      const savedData = localStorage.getItem(STORAGE_KEY)
      expect(savedData).toBeTruthy()
      const todos = JSON.parse(savedData!)
      expect(todos[0].text).toBe(longTaskName)
      expect(todos[0].text.length).toBe(500)
    })

    it('Edge-002: ID重複を防ぐため、Date.now()を使用している', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 2つのタスクを素早く追加
      fireEvent.change(input, { target: { value: 'タスク1' } })
      fireEvent.click(addButton)
      fireEvent.change(input, { target: { value: 'タスク2' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('タスク1')).toBeInTheDocument()
        expect(screen.getByText('タスク2')).toBeInTheDocument()
      })

      // localStorageから取得してIDが異なることを確認
      const savedData = localStorage.getItem(STORAGE_KEY)
      const todos = JSON.parse(savedData!)
      expect(todos).toHaveLength(2)
      expect(todos[0].id).not.toBe(todos[1].id)
    })

    it('Edge-003: localStorageが無効な場合でもエラーにならない', async () => {
      // コンソールエラーをモック化
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // localStorageをモック化して無効化
      const originalSetItem = Storage.prototype.setItem
      const mockSetItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })
      Storage.prototype.setItem = mockSetItem

      try {
        render(
          <BrowserRouter>
            <TestUserTodo />
          </BrowserRouter>
        )

        const input = screen.getByPlaceholderText(/新しいタスクを入力/)
        const addButton = screen.getByRole('button', { name: /➕ 追加/ })

        // タスクを追加しようとする
        fireEvent.change(input, { target: { value: 'テストタスク' } })
        fireEvent.click(addButton)

        // UIには表示される（メモリ上のstateは動作する）
        await waitFor(() => {
          expect(screen.getByText('テストタスク')).toBeInTheDocument()
        })

        // setItemが呼ばれたことを確認（エラーがスローされた）
        expect(mockSetItem).toHaveBeenCalled()
      } finally {
        // 必ずクリーンアップ
        Storage.prototype.setItem = originalSetItem
        consoleErrorSpy.mockRestore()
      }
    })

    it('Edge-004: 破損したlocalStorageデータを読み込んでも正常動作する', async () => {
      // 破損したJSONデータをlocalStorageに設定
      localStorage.setItem(STORAGE_KEY, '{invalid json}')

      // コンソールエラーをモック化
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      // 空の状態で表示される
      await waitFor(() => {
        expect(screen.getByText(/まだタスクがありません/)).toBeInTheDocument()
      })

      // エラーがコンソールに記録される
      expect(consoleErrorSpy).toHaveBeenCalled()

      // 新しいタスクを追加できる
      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      fireEvent.change(input, { target: { value: '新しいタスク' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('新しいタスク')).toBeInTheDocument()
      })

      consoleErrorSpy.mockRestore()
    })

    it('Edge-005: 10個のタスクを処理できる（パフォーマンス確認）', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // 10個のタスクを追加（テスト速度のため）
      for (let i = 1; i <= 10; i++) {
        fireEvent.change(input, { target: { value: `タスク${i}` } })
        fireEvent.click(addButton)
      }

      // 最後のタスクが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('タスク10')).toBeInTheDocument()
      })

      // チェックボックスが10個あることを確認
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(10)

      // 統計が正しく表示されることを確認
      expect(screen.getByText(/合計 10 個のタスク/)).toBeInTheDocument()
    })

    it('Edge-006: XSS攻撃を防ぐ（Reactのデフォルトエスケープ）', async () => {
      render(
        <BrowserRouter>
          <TestUserTodo />
        </BrowserRouter>
      )

      const input = screen.getByPlaceholderText(/新しいタスクを入力/)
      const addButton = screen.getByRole('button', { name: /➕ 追加/ })

      // XSS攻撃を試みるタスク名
      const xssTaskName = '<script>alert("XSS")</script>'

      fireEvent.change(input, { target: { value: xssTaskName } })
      fireEvent.click(addButton)

      await waitFor(() => {
        // テキストとして表示される（HTMLとして解釈されない）
        expect(screen.getByText(xssTaskName)).toBeInTheDocument()
      })

      // Reactはデフォルトでエスケープするため、
      // テキストノードとして安全に表示される
      const tasks = screen.getAllByRole('checkbox')
      expect(tasks).toHaveLength(1)
    })

    it('Edge-007: generateStorageKeyが日本語を含む文字列をサポート', () => {
      // 日本語を含む開発者名
      const japaneseName = '田中太郎'
      const key = generateStorageKey(japaneseName)

      // 日本語がそのまま保持される
      expect(key).toBe('田中太郎-todos')
      
      // スペースを含む場合はハイフンに変換
      const nameWithSpace = '浜崎 秀寿'
      const keyWithHyphen = generateStorageKey(nameWithSpace)
      expect(keyWithHyphen).toBe('浜崎-秀寿-todos')
      
      // 特殊文字もそのまま保持
      const specialName = 'Test@User#123$'
      const specialKey = generateStorageKey(specialName)
      expect(specialKey).toBe('Test@User#123$-todos')
    })
  })
})
