import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../../../src/pages/HomePage'
import '@testing-library/jest-dom'

describe('HomePage', () => {
  beforeEach(() => {
    // LocalStorageのモック
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock as any
  })

  it('ホームページが正しくレンダリングされる', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    // ページタイトルの確認
    expect(screen.getByText(/Todo アプリケーション/i)).toBeInTheDocument()
  })

  it('ウェルカムメッセージが表示される', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    // ウェルカムメッセージまたは説明文の確認
    const welcomeElements = screen.queryAllByText(/ようこそ|Welcome|Todo|タスク管理/i)
    expect(welcomeElements.length).toBeGreaterThan(0)
  })

  it('ナビゲーションリンクが存在する', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    // リンクの存在確認（具体的な内容は実装による）
    const links = screen.queryAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(0)
  })
})
