import React from 'react'

export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  style?: React.CSSProperties
}

export const Text: React.FC<TextInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = '',
  style = {}
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={{
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        flex: 1,
        ...style
      }}
    />
  )
}
