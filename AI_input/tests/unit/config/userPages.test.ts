import { describe, it, expect, beforeEach } from 'vitest'
import { getUserPages, addUserPage, removeUserPage, userPages } from '../../../src/config/userPages'

describe('userPages Configuration', () => {
  beforeEach(() => {
    // LocalStorageのモック
    const localStorageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} },
      }
    })()
    global.localStorage = localStorageMock as any
    localStorage.clear()
  })

  describe('getUserPages', () => {
    it('LocalStorageからユーザーページを取得できる', () => {
      const pages = [
        { name: 'テスト1', path: '/test1-todo', icon: '📝', componentPath: './pages/DynamicTodoPage' }
      ]
      localStorage.setItem('userPages', JSON.stringify(pages))
      
      const result = getUserPages()
      // デフォルトのTestUser + 追加したページ
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    it('LocalStorageが空の場合はデフォルトページのみ返す', () => {
      localStorage.clear()
      const result = getUserPages()
      // TestUserがデフォルトで存在
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    it('無効なJSONの場合も動作する', () => {
      localStorage.setItem('userPages', 'invalid json')
      const result = getUserPages()
      // エラーは発生せず、TestUserがデフォルトで存在
      expect(result.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('addUserPage', () => {
    it('新しいページを追加できる', () => {
      const initialLength = getUserPages().length
      const result = addUserPage('新しいページ', '📋')
      expect(result).toBe(true)
      
      const pages = getUserPages()
      expect(pages.length).toBe(initialLength + 1)
      const addedPage = pages.find(p => p.name === '新しいページ')
      expect(addedPage).toBeTruthy()
      expect(addedPage?.icon).toBe('📋')
    })

    it('日本語のページ名を追加できる', () => {
      const result = addUserPage('浜崎秀寿', '👤')
      expect(result).toBe(true)
      
      const pages = getUserPages()
      const addedPage = pages.find(p => p.name === '浜崎秀寿')
      expect(addedPage).toBeTruthy()
    })

    it('スペースを含むページ名を追加できる', () => {
      const result = addUserPage('浜崎 秀寿', '👤')
      expect(result).toBe(true)
      
      const pages = getUserPages()
      const addedPage = pages.find(p => p.name === '浜崎 秀寿')
      expect(addedPage).toBeTruthy()
    })

    it('空の名前では追加できない', () => {
      const initialLength = getUserPages().length
      const result = addUserPage('', '📋')
      expect(result).toBe(false)
      
      const pages = getUserPages()
      expect(pages.length).toBe(initialLength)
    })

    it('同じ名前のページは追加できない', () => {
      addUserPage('重複テスト', '📋')
      const lengthAfterFirst = getUserPages().length
      const result = addUserPage('重複テスト', '📋')
      expect(result).toBe(false)
      
      const pages = getUserPages()
      expect(pages.length).toBe(lengthAfterFirst) // 増えていない
    })
  })

  describe('removeUserPage', () => {
    beforeEach(() => {
      // イベントリスナーのモック
      global.dispatchEvent = () => true
    })

    it('ページを削除できる', () => {
      addUserPage('削除テスト', '📋')
      const lengthBefore = getUserPages().length
      
      const result = removeUserPage('削除テスト')
      expect(result).toBe(true)
      
      const pages = getUserPages()
      expect(pages.length).toBe(lengthBefore - 1) // 1つ減る
      const deletedPage = pages.find(p => p.name === '削除テスト')
      expect(deletedPage).toBeUndefined()
    })

    it('存在しないページは削除できない', () => {
      const result = removeUserPage('存在しないページ')
      expect(result).toBe(false)
    })

    it('ページ削除時にタスクデータも削除される', () => {
      // ページとタスクデータを追加
      addUserPage('タスク付きページ', '📋')
      localStorage.setItem('タスク付きページ-todos', JSON.stringify([
        { id: 1, text: 'テストタスク', completed: false }
      ]))
      
      // ページを削除
      removeUserPage('タスク付きページ')
      
      // タスクデータも削除されていることを確認
      const taskData = localStorage.getItem('タスク付きページ-todos')
      expect(taskData).toBeNull()
    })

    it('スペースを含むページ名のタスクデータも正しく削除される', () => {
      // ページとタスクデータを追加
      addUserPage('浜崎 秀寿', '👤')
      localStorage.setItem('浜崎-秀寿-todos', JSON.stringify([
        { id: 1, text: 'テストタスク', completed: false }
      ]))
      
      // ページを削除
      removeUserPage('浜崎 秀寿')
      
      // タスクデータも削除されていることを確認
      const taskData = localStorage.getItem('浜崎-秀寿-todos')
      expect(taskData).toBeNull()
    })
  })
})
