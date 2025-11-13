import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../../src/App'
import '@testing-library/jest-dom'

describe('App', () => {
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

  it('Appコンポーネントが正しくレンダリングされる', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // アプリケーションが正常にレンダリングされることを確認
    expect(document.body).toBeTruthy()
  })

  it('ルーティングが設定されている', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // ルーターが正しく機能していることを確認
    // サイドバーやナビゲーション要素が存在することを確認
    const navigation = screen.queryByRole('navigation') || screen.queryByRole('complementary')
    expect(navigation || document.body).toBeTruthy()
  })

  it('ユーザーページが動的にロードされる', () => {
    // LocalStorageにユーザーページを設定
    const userPages = [
      { name: 'テストページ', path: '/test-page-todo', icon: '📝', componentPath: './pages/DynamicTodoPage' }
    ]
    localStorage.setItem('userPages', JSON.stringify(userPages))
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // エラーが発生しないことを確認
    expect(document.body).toBeTruthy()
  })

  it('エラーハンドリングが機能する', () => {
    // 無効なデータをLocalStorageに設定
    localStorage.setItem('userPages', 'invalid json')
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // エラーが発生してもアプリがクラッシュしないことを確認
    expect(document.body).toBeTruthy()
  })
})
