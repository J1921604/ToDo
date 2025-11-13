import React from 'react'

export interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  style?: React.CSSProperties
}

export const Small = React.memo<ButtonProps>(({
  onClick,
  children,
  disabled = false,
  style = {}
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 10px',
        fontSize: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
    >
      {children}
    </button>
  )
})
