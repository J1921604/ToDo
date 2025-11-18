import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>📝 React Todo アプリケーション</h1>
      <p>開発研修用Todoアプリへようこそ</p>
      <div style={{ marginTop: '30px' }}>
        <h2>個人専用ページ</h2>
        <Link
          to="/testuser-todo"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          TestUserのTodoページを開く
        </Link>
      </div>
    </div>
  )
}

export default HomePage
