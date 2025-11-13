import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { userPages, addUserPage, removeUserPage, updateUserPage, type UserPageConfig } from '../../config/userPages'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  
  // 初期値はLocalStorageから取得
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

  // userPagesの変更を監視
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('userPages')
      if (saved) {
        try {
          setPages(JSON.parse(saved) as UserPageConfig[])
        } catch {
          setPages([...userPages])
        }
      }
    }

    window.addEventListener('userPagesUpdated', handleUpdate)
    return () => window.removeEventListener('userPagesUpdated', handleUpdate)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      alert('名前を入力してください')
      return
    }
    
    const pageName = newPageName.trim()
    const success = addUserPage(pageName, '📝')
    if (success) {
      const newPath = `/${pageName.toLowerCase()}-todo`
      setNewPageName('')
      setShowAddForm(false)
      
      // ページ追加成功後、新しいページに自動遷移
      setTimeout(() => {
        navigate(newPath)
      }, 100)
    } else {
      alert('ページの追加に失敗しました')
    }
  }

  const handleDeletePage = (name: string, path: string) => {
    if (window.confirm(`${name}のページを削除しますか？`)) {
      const success = removeUserPage(name)
      if (success) {
        if (location.pathname === path) {
          navigate('/')
        }
        alert(`${name}のページを削除しました！\n\nページを削除するには、開発サーバーを再起動してください：\n1. Ctrl+C でサーバーを停止\n2. npm run dev で再起動`)
      } else {
        alert('ページの削除に失敗しました')
      }
    }
  }

  const handleEditStart = (name: string) => {
    setEditingPage(name)
    setEditName(name)
  }

  const handleEditSave = (oldName: string) => {
    if (!editName.trim()) {
      alert('名前を入力してください')
      return
    }

    const success = updateUserPage(oldName, editName.trim())
    if (success) {
      setEditingPage(null)
      setEditName('')
      alert(`ページ名を「${editName}」に変更しました！\n\nページを更新するには、開発サーバーを再起動してください：\n1. Ctrl+C でサーバーを停止\n2. npm run dev で再起動`)
    } else {
      alert('ページ名の変更に失敗しました')
    }
  }

  const handleEditCancel = () => {
    setEditingPage(null)
    setEditName('')
  }

  return (
    <nav
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto'
      }}
    >
      <h2 style={{ marginBottom: '30px', fontSize: '20px' }}>📝 タスク管理</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link
          to="/"
          style={{
            padding: '12px 16px',
            backgroundColor: isActive('/') ? '#34495e' : 'transparent',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
        >
          🏠 ホーム
        </Link>

        {pages.map((page) => (
          <div
            key={page.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {editingPage === page.name ? (
              <div style={{
                padding: '8px',
                backgroundColor: '#34495e',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #7f8c8d',
                    fontSize: '14px'
                  }}
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleEditSave(page.name)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    保存
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{
                      flex: 1,
                      padding: '6px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Link
                  to={page.path}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: isActive(page.path) ? '#34495e' : 'transparent',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s'
                  }}
                >
                  📝 {page.name}のTodo
                </Link>
                <button
                  onClick={() => handleEditStart(page.name)}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="ページ名を編集"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeletePage(page.name, page.path)}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="ページを削除"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ➕ 新規ページ追加
          </button>
        ) : (
          <div style={{
            padding: '16px',
            backgroundColor: '#34495e',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <input
              type="text"
              placeholder="名前 (例: Tanaka)"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #7f8c8d',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddPage}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewPageName('')
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#34495e', borderRadius: '4px' }}>
        <p style={{ fontSize: '12px', margin: 0, color: '#bdc3c7' }}>
          React研修用Todoアプリ
        </p>
      </div>
    </nav>
  )
}

export default Sidebar
