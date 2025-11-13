import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestUserTodo from '../../src/pages/TestUserTodo'

describe('Personal Page Setup - Routing', () => {
  test('個人ページが正常にレンダリングされる', () => {
    render(
      <BrowserRouter>
        <TestUserTodo />
      </BrowserRouter>
    )
    
    // ページタイトルが表示されることを確認
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('個人ページに開発者名が表示される', () => {
    render(
      <BrowserRouter>
        <TestUserTodo />
      </BrowserRouter>
    )
    
    // 開発者名を含むタイトルが表示されることを確認
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('TestUser')
  })

  test('個人ページにタスク入力エリアが表示される', () => {
    render(
      <BrowserRouter>
        <TestUserTodo />
      </BrowserRouter>
    )
    
    // 入力フィールドが表示されることを確認
    const input = screen.getByPlaceholderText(/タスク/i)
    expect(input).toBeInTheDocument()
  })
})
