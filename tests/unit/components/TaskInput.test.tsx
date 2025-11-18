import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Text as InputText } from '../../../src/components/atoms/Input/Text'

describe('TaskInput Component Tests (US1)', () => {
  it('テキスト入力フィールドが正しく表示される', () => {
    const mockOnChange = vi.fn()
    render(
      <InputText
        value=""
        onChange={mockOnChange}
        placeholder="新しいタスクを入力"
      />
    )

    const input = screen.getByPlaceholderText('新しいタスクを入力')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('テキスト入力時にonChangeが呼ばれる', () => {
    const mockOnChange = vi.fn()
    render(
      <InputText
        value=""
        onChange={mockOnChange}
        placeholder="新しいタスクを入力"
      />
    )

    const input = screen.getByPlaceholderText('新しいタスクを入力')
    fireEvent.change(input, { target: { value: 'テストタスク' } })

    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('テストタスク')
  })

  it('Enterキー押下時にonKeyDownが呼ばれる', () => {
    const mockOnChange = vi.fn()
    const mockOnKeyDown = vi.fn()
    
    render(
      <InputText
        value="テストタスク"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
        placeholder="新しいタスクを入力"
      />
    )

    const input = screen.getByPlaceholderText('新しいタスクを入力')
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
  })

  it('空文字列でも入力フィールドとして機能する', () => {
    const mockOnChange = vi.fn()
    render(
      <InputText
        value=""
        onChange={mockOnChange}
        placeholder="新しいタスクを入力"
      />
    )

    const input = screen.getByPlaceholderText('新しいタスクを入力')
    
    // テキストを入力
    fireEvent.change(input, { target: { value: 'test' } })
    expect(mockOnChange).toHaveBeenCalledWith('test')
    
    // スペースのみの文字列を入力
    fireEvent.change(input, { target: { value: '   ' } })
    expect(mockOnChange).toHaveBeenCalledWith('   ')
  })

  it('長いテキストも入力できる', () => {
    const mockOnChange = vi.fn()
    const longText = 'a'.repeat(500) // 500文字のテキスト
    
    render(
      <InputText
        value=""
        onChange={mockOnChange}
        placeholder="新しいタスクを入力"
      />
    )

    const input = screen.getByPlaceholderText('新しいタスクを入力')
    fireEvent.change(input, { target: { value: longText } })

    expect(mockOnChange).toHaveBeenCalledWith(longText)
  })
})
