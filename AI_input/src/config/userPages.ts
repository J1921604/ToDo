/**
 * Todo App - User Pages Configuration
 * 
 * How to add your personal Todo page:
 * 1. Copy template-no-delete.tsx to src/pages/YourNameTodo.tsx
 * 2. Add entry to this config file
 * 3. Restart dev server (npm run dev)
 * 
 * Example:
 * {
 *   name: 'Tanaka',
 *   path: '/tanaka-todo',
 *   component: () => import('./pages/TanakaTodo'),
 *   icon: '📝'
 * }
 */

export interface UserPageConfig {
  name: string
  path: string
  componentPath: string
  icon?: string
}

export const userPages: UserPageConfig[] = [
  {
    name: 'TestUser',
    path: '/testuser-todo',
    componentPath: './pages/TestUserTodo',
    icon: '📝'
  }
]

/**
 * ユーザーページの配列を取得する
 * @returns ユーザーページの配列
 */
export const getUserPages = (): UserPageConfig[] => {
  return [...userPages]
}

/**
 * 新しいユーザーページを追加する
 * @param name ユーザー名（例: "Tanaka"）
 * @param icon アイコン（例: "📝"）
 * @returns 成功した場合はtrue
 */
export const addUserPage = (name: string, icon: string = '📝'): boolean => {
  try {
    // 空の名前をチェック
    if (!name || name.trim() === '') {
      console.error('ページ名は必須です')
      return false
    }
    
    // 日本語対応：小文字に変換（エンコードはReact Routerが自動処理）
    const path = `/${name.toLowerCase()}-todo`
    const componentPath = `./pages/${name}Todo`
    
    // 既に存在するかチェック
    const exists = userPages.some(page => page.name === name || page.path === path)
    if (exists) {
      console.error(`ページ "${name}" は既に存在します`)
      return false
    }
    
    // 新しいページを追加
    userPages.push({
      name,
      path,
      componentPath,
      icon
    })
    
    // LocalStorageに保存（再起動時に復元するため）
    localStorage.setItem('userPages', JSON.stringify(userPages))
    
    // カスタムイベントを発火してApp.tsxに通知
    window.dispatchEvent(new Event('userPagesUpdated'))
    
    // 動的にページファイルを作成
    createPageFile(name)
    
    return true
  } catch (error) {
    console.error('ページ追加エラー:', error)
    return false
  }
}

/**
 * 動的にページファイルを作成する（メモリ内）
 */
const createPageFile = (name: string) => {
  // ブラウザ側では実際のファイルは作成できないため、
  // LocalStorageにコンポーネント情報を保存
  const pageInfo = {
    name,
    storageKey: `${name.toLowerCase()}-todos`,
    created: new Date().toISOString()
  }
  localStorage.setItem(`page-info-${name}`, JSON.stringify(pageInfo))
}

/**
 * ユーザーページ名を更新する
 * @param oldName 現在のユーザー名
 * @param newName 新しいユーザー名
 * @returns 成功した場合はtrue
 */
export const updateUserPage = (oldName: string, newName: string): boolean => {
  try {
    const index = userPages.findIndex(page => page.name === oldName)
    if (index === -1) {
      console.error(`ページ "${oldName}" が見つかりません`)
      return false
    }
    
    // 新しい名前が既に存在するかチェック
    if (oldName !== newName) {
      const exists = userPages.some(page => page.name === newName)
      if (exists) {
        console.error(`ページ "${newName}" は既に存在します`)
        return false
      }
    }
    
    // ページ名を更新（日本語対応：小文字に変換、エンコードはReact Routerが自動処理）
    const newPath = `/${newName.toLowerCase()}-todo`
    const newComponentPath = `./pages/${newName}Todo`
    
    userPages[index] = {
      ...userPages[index],
      name: newName,
      path: newPath,
      componentPath: newComponentPath
    }
    
    // LocalStorageに保存
    localStorage.setItem('userPages', JSON.stringify(userPages))
    
    // カスタムイベントを発火してApp.tsxに通知
    window.dispatchEvent(new Event('userPagesUpdated'))
    
    return true
  } catch (error) {
    console.error('ページ更新エラー:', error)
    return false
  }
}

/**
 * ユーザーページを削除する
 * @param name ユーザー名
 * @returns 成功した場合はtrue
 */
export const removeUserPage = (name: string): boolean => {
  try {
    const index = userPages.findIndex(page => page.name === name)
    if (index === -1) {
      console.error(`ページ "${name}" が見つかりません`)
      return false
    }
    
    // ページのタスクデータをLocalStorageから削除
    const storageKey = `${name.trim().replace(/\s+/g, '-')}-todos`
    localStorage.removeItem(storageKey)
    console.log(`タスクデータを削除しました: ${storageKey}`)
    
    // ページ情報ファイルも削除
    const pageInfoKey = `page-info-${name}`
    localStorage.removeItem(pageInfoKey)
    
    // 配列から削除
    userPages.splice(index, 1)
    
    // LocalStorageに保存
    localStorage.setItem('userPages', JSON.stringify(userPages))
    
    // カスタムイベントを発火してApp.tsxに通知
    window.dispatchEvent(new Event('userPagesUpdated'))
    
    return true
  } catch (error) {
    console.error('ページ削除エラー:', error)
    return false
  }
}

// LocalStorageから復元（初回読み込み時）
const loadUserPages = () => {
  try {
    const saved = localStorage.getItem('userPages')
    
    if (saved) {
      const savedPages = JSON.parse(saved) as UserPageConfig[]
      
      // 既存のページを保持しつつ、保存されたページをマージ
      savedPages.forEach(savedPage => {
        const exists = userPages.some(page => page.name === savedPage.name)
        if (!exists) {
          userPages.push(savedPage)
        }
      })
    }
  } catch (error) {
    console.error('ページ復元エラー:', error)
  }
}

// 初回ロード時に実行
loadUserPages()
