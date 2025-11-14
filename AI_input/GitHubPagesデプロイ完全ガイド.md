# GitHub Pages デプロイ完全ガイド

**プロジェクト**: React Todo App  
**リポジトリ**: https://github.com/J1921604/ToDo  
**本番URL**: https://j1921604.github.io/ToDo/  
**作成日**: 2025年11月14日

---

## 目次

1. [初回セットアップ](#初回セットアップ)
2. [GitHub Pages設定](#github-pages設定)
3. [自動デプロイ（GitHub Actions）](#自動デプロイgithub-actions)
4. [手動デプロイ手順](#手動デプロイ手順)
5. [トラブルシューティング](#トラブルシューティング)
6. [デプロイ検証チェックリスト](#デプロイ検証チェックリスト)

---

## 初回セットアップ

### 1. GitHub Pages設定の有効化

**重要**: GitHub Actionsを使用する前に、必ずGitHub Pages設定を有効化する必要があります。

#### 手順:

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/J1921604/ToDo
   ```

2. **Settings タブを開く**
   - リポジトリページ上部のタブから「Settings」をクリック

3. **Pages 設定を開く**
   - 左サイドバーから「Pages」をクリック
   - URL: `https://github.com/J1921604/ToDo/settings/pages`

4. **Source（ソース）を設定**
   
   **方法A: GitHub Actions を使用（推奨）**
   - 「Source」セクションで **「GitHub Actions」** を選択
   - これにより、`.github/workflows/deploy.yml` ワークフローが自動的に実行されます
   
   **方法B: ブランチから直接デプロイ**
   - 「Source」で「Deploy from a branch」を選択
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Save をクリック

5. **確認**
   - 設定保存後、「Your site is live at https://j1921604.github.io/ToDo/」というメッセージが表示されます
   - 初回は数分かかる場合があります

---

## GitHub Pages設定

### 現在の設定状態

```yaml
Repository: J1921604/ToDo
Base Path: /ToDo/
Build Tool: Vite
Framework: React 18 + TypeScript
```

### vite.config.ts の設定

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ToDo/' : '/',
  plugins: [react()],
  server: {
    port: 1234
  }
})
```

**重要ポイント**:
- `base: '/ToDo/'` - リポジトリ名と一致させる（大文字小文字も正確に）
- 開発環境では `/` を使用（localhost用）
- 本番環境では `/ToDo/` を使用（GitHub Pages用）

### src/main.tsx の設定

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const basename = import.meta.env.MODE === 'production' ? '/ToDo/' : '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

**重要ポイント**:
- `basename` は `vite.config.ts` の `base` と一致させる
- React Router のルーティングに必要

---

## 自動デプロイ（GitHub Actions）

### ワークフロー設定

**ファイル**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### トリガー条件

1. **自動トリガー**: `main` ブランチへの push
2. **手動トリガー**: GitHub Actions タブから「Run workflow」

### デプロイフロー

```
コード修正
    ↓
git commit & push to main
    ↓
GitHub Actions トリガー
    ↓
1. Type Check (TypeScript)
    ↓
2. Build (npm run build)
    ↓
3. Upload Artifact (dist/)
    ↓
4. Deploy to GitHub Pages
    ↓
本番サイト更新
https://j1921604.github.io/ToDo/
```

---

## 手動デプロイ手順

### 方法1: GitHub Actions 手動実行

1. **GitHub Actions タブを開く**
   ```
   https://github.com/J1921604/ToDo/actions
   ```

2. **「Deploy to GitHub Pages」ワークフローを選択**

3. **「Run workflow」ボタンをクリック**
   - Branch: `main` を選択
   - 「Run workflow」を確認

4. **実行完了を待つ**（通常2〜5分）

### 方法2: ローカルビルド + 手動プッシュ

**非推奨**: GitHub Actionsの使用を推奨

```powershell
# 1. ローカルビルド
npm run build

# 2. gh-pages ブランチ作成（初回のみ）
git checkout --orphan gh-pages
git rm -rf .
Copy-Item -Path dist\* -Destination . -Recurse
git add -A
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 3. main ブランチに戻る
git checkout main
```

---

## トラブルシューティング

### エラー1: "Not Found (404)" - GitHub Pages未設定

**症状**:
```
Error: Creating Pages deployment failed
Error: HttpError: Not Found
Ensure GitHub Pages has been enabled: https://github.com/J1921604/ToDo/settings/pages
```

**原因**: GitHub Pages設定が有効化されていない

**解決方法**:
1. https://github.com/J1921604/ToDo/settings/pages を開く
2. Source を「GitHub Actions」に設定
3. Save をクリック
4. ワークフローを再実行

---

### エラー2: 画面が真っ白

**症状**: https://j1921604.github.io/ToDo/ が空白ページ

**原因と解決方法**:

#### 原因1: basename 不一致

**確認**:
```typescript
// vite.config.ts
base: '/ToDo/'  // ← リポジトリ名と一致？

// src/main.tsx
const basename = '/ToDo/'  // ← vite.config.ts と一致？
```

**修正**:
```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ToDo/' : '/',
  // ...
})

// src/main.tsx
const basename = import.meta.env.MODE === 'production' ? '/ToDo/' : '/'
```

#### 原因2: パスフォーマット不一致

**確認**:
```typescript
// src/config/userPages.ts
export const userPages: UserPage[] = [
  {
    name: 'TestUser',
    path: '/testuser-todo',  // ← URL形式？ (正しい)
    // path: './pages/TestUserTodo',  // ← ファイルパス形式？ (誤り)
    icon: '📝'
  }
]
```

**修正**:
- すべてのパスをURL形式 (`/xxx-todo`) に統一
- ファイルパス形式 (`./pages/XxxPage`) は使用しない

---

### エラー3: ルーティングが動作しない

**症状**: ページ遷移時に404エラー

**原因**: SPA（Single Page Application）のルーティング設定

**解決方法**: GitHub Pagesは自動的にSPAルーティングをサポートします（GitHub Actions使用時）

---

### エラー4: ビルドエラー

**症状**: GitHub Actions で `npm run build` が失敗

**確認コマンド**:
```powershell
# ローカルで型チェック
npx tsc --noEmit

# ローカルでビルドテスト
npm run build
```

**よくあるエラー**:
- TypeScriptエラー → `npx tsc --noEmit` で確認
- 依存関係エラー → `npm ci` を実行
- メモリ不足 → `package.json` の build スクリプトに `--max-old-space-size=4096` を追加

---

### エラー5: デプロイ後も古いバージョンが表示される

**原因**: ブラウザキャッシュ

**解決方法**:
1. **ハードリロード**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **キャッシュクリア**
   - Chrome: DevTools → Network タブ → 「Disable cache」をチェック
   - Firefox: `Ctrl + Shift + Delete` → キャッシュをクリア

3. **プライベートモードで確認**
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`

---

## デプロイ検証チェックリスト

### ビルド前チェック

- [ ] **TypeScript型チェック**: `npx tsc --noEmit` → 0エラー
- [ ] **ローカルビルド**: `npm run build` → 成功
- [ ] **ローカルプレビュー**: `npm run preview` → http://localhost:4173/ToDo/ で表示確認
  - [ ] ホームページ表示
  - [ ] サイドバーナビゲーション動作
  - [ ] TestUserページ表示
  - [ ] Todo CRUD操作動作
  - [ ] LocalStorage保存動作

### デプロイ後チェック

- [ ] **GitHub Actions実行成功**: すべてのステップが緑色チェックマーク
- [ ] **GitHub Pages設定確認**: Source が「GitHub Actions」
- [ ] **本番URL アクセス**: https://j1921604.github.io/ToDo/
  - [ ] ホームページが表示される（404でない）
  - [ ] サイドバーが表示される
  - [ ] 「🏠 ホーム」リンククリック → ページ遷移成功
  - [ ] 「📝 TestUserのTodo」クリック → `/testuser-todo` 表示
  - [ ] タスク追加 → リスト表示
  - [ ] チェックボックス → 完了状態切り替え
  - [ ] 削除ボタン → タスク削除
  - [ ] フィルター切り替え → 表示切り替え
  - [ ] ページリロード → データ保持（LocalStorage）

### パフォーマンスチェック

- [ ] **初期ロード時間**: 3秒以内
- [ ] **CRUD操作**: 100ms以内
- [ ] **メモリ使用量**: 50MB以下（DevTools Memory で確認）
- [ ] **バンドルサイズ**: dist/assets/*.js 合計 500KB以下

---

## デプロイ完了後の次のステップ

### 1. tasks.md 更新

完了したタスクにチェックマークを追加:

```markdown
- [X] T076: ローカルビルドテスト
- [X] T077: プレビュー確認
- [X] T080: mainブランチへマージ
- [X] T081: GitHub Actions自動デプロイ確認
- [X] T082: 本番URLで最終動作確認
```

### 2. 仕様書.md 更新

デプロイ情報を追加:

```markdown
## デプロイ情報

- **本番URL**: https://j1921604.github.io/ToDo/
- **デプロイ方法**: GitHub Actions (自動)
- **最終デプロイ日**: 2025年11月14日
- **ビルドツール**: Vite 4.2.0
- **ホスティング**: GitHub Pages
```

### 3. README.md 更新

デプロイ手順を追加:

```markdown
## デプロイ

本番環境: https://j1921604.github.io/ToDo/

### 自動デプロイ
`main` ブランチへのpushで自動的にGitHub Pagesにデプロイされます。

### 手動デプロイ
GitHub Actions タブから「Run workflow」を実行してください。
```

---

## よくある質問（FAQ）

### Q1: デプロイにどのくらい時間がかかりますか？

**A**: 通常2〜5分です。
- ビルド: 1〜2分
- アップロード: 30秒〜1分
- デプロイ: 1〜2分

### Q2: デプロイ失敗時のログはどこで確認できますか？

**A**: GitHub Actions タブ
```
https://github.com/J1921604/ToDo/actions
```
失敗したワークフローをクリック → 各ステップの詳細ログを確認

### Q3: ローカルと本番で動作が異なる場合は？

**A**: 以下を確認:
1. basename設定 (`/ToDo/` vs `/`)
2. 環境変数 (`import.meta.env.MODE`)
3. ビルド出力 (`dist/index.html` の paths)
4. ブラウザキャッシュ（ハードリロード）

### Q4: 複数人で開発する場合の注意点は？

**A**:
- `main` ブランチは保護する（Settings → Branches → Branch protection rules）
- Pull Request経由でマージ
- レビュー後にマージ
- デプロイ前にプレビュー環境で確認

---

## 参考リンク

### 公式ドキュメント

- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [GitHub Actions公式ドキュメント](https://docs.github.com/ja/actions)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [React Router公式ドキュメント](https://reactrouter.com/)

### プロジェクト固有

- **リポジトリ**: https://github.com/J1921604/ToDo
- **本番URL**: https://j1921604.github.io/ToDo/
- **GitHub Actions**: https://github.com/J1921604/ToDo/actions
- **Pages設定**: https://github.com/J1921604/ToDo/settings/pages

---
