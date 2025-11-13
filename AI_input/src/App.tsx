import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TestUserTodo from './pages/TestUserTodo'
import Sidebar from './components/organisms/Sidebar'
import { userPages, type UserPageConfig } from './config/userPages'
import DynamicTodoPage from './pages/DynamicTodoPage'

const App: React.FC = () => {
  // userPagesの状態を管理（再レンダリングを発生させるため）
  // 初期値はLocalStorageから取得、なければuserPagesを使用
  const getInitialPages = (): UserPageConfig[] => {
    const saved = localStorage.getItem('userPages')
    if (saved) {
      try {
        return JSON.parse(saved) as UserPageConfig[]
      } catch {
        return [...userPages]
      }
    }
    return [...userPages]
  }

  const [pages, setPages] = useState<UserPageConfig[]>(getInitialPages())

  // LocalStorageの変更を監視
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('userPages')
      if (saved) {
        const savedPages = JSON.parse(saved) as UserPageConfig[]
        setPages([...savedPages])
      }
    }

    // カスタムイベントリスナーを追加（同一タブ内の変更用）
    window.addEventListener('userPagesUpdated', handleStorageChange)
    // storage イベント（他タブの変更用）
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('userPagesUpdated', handleStorageChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '250px', width: 'calc(100% - 250px)', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {pages.map((page) => {
            // TestUserの場合のみ専用コンポーネントを使用
            if (page.componentPath === './pages/TestUserTodo') {
              return <Route key={page.path} path={page.path} element={<TestUserTodo />} />
            }
            // その他は動的ページ
            return (
              <Route 
                key={page.path} 
                path={page.path} 
                element={<DynamicTodoPage userName={page.name} />} 
              />
            )
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
