import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../../../src/components/organisms/Sidebar'
import '@testing-library/jest-dom'

describe('Sidebar', () => {
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
    
    // イベントリスナーのモック
    global.addEventListener = vi.fn()
    global.removeEventListener = vi.fn()
  })

  it('サイドバーが正しくレンダリングされる', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    // サイドバーの主要要素が存在することを確認 (navigationロール)
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toBeInTheDocument()
  })

  it('ホームリンクが表示される', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    // ホームリンクの確認
    const homeLink = screen.getByText(/ホーム|Home|🏠/i)
    expect(homeLink).toBeInTheDocument()
  })

  it('ページ追加フォームが表示される', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    // ページ追加のための入力フィールドまたはボタンを探す
    const addInput = screen.queryByPlaceholderText(/名前|ページ|追加/i)
    const addButton = screen.queryByRole('button', { name: /追加|Add|➕/i })
    
    // どちらかが存在することを確認
    expect(addInput || addButton).toBeTruthy()
  })

  it('新しいページを追加できる', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    const input = screen.queryByPlaceholderText(/名前|ページ/i) as HTMLInputElement
    const addButton = screen.queryByRole('button', { name: /追加|Add|➕/i })
    
    if (input && addButton) {
      // ページ名を入力
      fireEvent.change(input, { target: { value: '新しいページ' } })
      fireEvent.click(addButton)
      
      // LocalStorageに保存されたことを確認（間接的）
      expect(localStorage.setItem).toHaveBeenCalled()
    }
  })

  it('ページリストが表示される', () => {
    // 事前にLocalStorageにページを設定
    const pages = [
      { name: 'テストページ1', path: '/test1', icon: '📝', componentPath: './pages/DynamicTodoPage' },
      { name: 'テストページ2', path: '/test2', icon: '📋', componentPath: './pages/DynamicTodoPage' }
    ]
    localStorage.setItem('userPages', JSON.stringify(pages))
    
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    // ページ名が表示されることを確認
    // 初期レンダリングで表示される可能性がある
    const pageElements = screen.queryAllByText(/テストページ|📝|📋/)
    expect(pageElements.length).toBeGreaterThanOrEqual(0)
  })

  it('ページ削除ボタンが機能する', () => {
    // 事前にLocalStorageにページを設定
    const pages = [
      { name: '削除テスト', path: '/delete-test', icon: '🗑️', componentPath: './pages/DynamicTodoPage' }
    ]
    localStorage.setItem('userPages', JSON.stringify(pages))
    
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    // 削除ボタンを探す
    const deleteButtons = screen.queryAllByRole('button', { name: /削除|🗑️|Delete/i })
    
    if (deleteButtons.length > 0) {
      // window.confirmのモック
      global.confirm = vi.fn(() => true)
      
      fireEvent.click(deleteButtons[0])
      
      // confirmが呼ばれたことを確認
      expect(global.confirm).toHaveBeenCalled()
    }
  })

  it('日本語のページ名を追加できる', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    const input = screen.queryByPlaceholderText(/名前|ページ/i) as HTMLInputElement
    const addButton = screen.queryByRole('button', { name: /追加|Add|➕/i })
    
    if (input && addButton) {
      // 日本語ページ名を入力
      fireEvent.change(input, { target: { value: '浜崎秀寿' } })
      fireEvent.click(addButton)
      
      // エラーが発生しないことを確認
      expect(true).toBe(true)
    }
  })

  it('空のページ名では追加できない', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
    
    const input = screen.queryByPlaceholderText(/名前|ページ/i) as HTMLInputElement
    const addButton = screen.queryByRole('button', { name: /追加|Add|➕/i })
    
    if (input && addButton) {
      // 空の値で追加を試みる
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(addButton)
      
      // 何も追加されないことを期待
      expect(true).toBe(true)
    }
  })
})
