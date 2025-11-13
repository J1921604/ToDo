# GitHub Pages デプロイ手順書

**📅 最終更新**: 2025年11月11日

## 📌 概要

このドキュメントでは、Todo AppをGitHub Pagesにデプロイする手順を説明します。

**✅ 本番デプロイ完了**: https://j1921604.github.io/ToDo/

---

## 📋 前提条件

- [x] GitHubアカウント
- [x] Node.js 16以上
- [x] npm 8以上
- [x] Git（ローカルマシン）
- [x] プロジェクトがGitHubリポジトリにプッシュ済み

---

## 🛠️ ステップ1: アプリケーション改修

### 1.1 vite.config.ts の修正

**場所**: `vite.config.ts`

**変更前**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1234,
  },
})
```

**変更後**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ToDo/',  // ← 追加！リポジトリ名に合わせる
  plugins: [react()],
  server: {
    port: 1234,
  },
})
```

**重要**: `base: '/ToDo/'` の `ToDo` 部分は**あなたのGitHubリポジトリ名**に変更してください。

### 1.2 Router のベースパス設定（必要な場合）

**場所**: `src/main.tsx` または `src/App.tsx`

もし `BrowserRouter` を使用している場合、`basename` プロパティを追加:

**変更前**:
```typescript
<BrowserRouter>
  <App />
</BrowserRouter>
```

**変更後**:
```typescript
<BrowserRouter basename="/ToDo/">
  <App />
</BrowserRouter>
```

**本プロジェクトでは**: `main.tsx` で `BrowserRouter` を使用しているため、この変更が必要です。

**修正箇所** (`src/main.tsx`):
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/ToDo/">  {/* ← 追加 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

---

## 📦 ステップ2: ビルドテスト

ローカルでビルドが正常に動作することを確認します。

### 2.1 ビルド実行

```powershell
npm run build
```

**期待される出力**:
```
vite v4.2.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a1b2c3d4.css    2.35 kB │ gzip:  0.89 kB
dist/assets/index-e5f6g7h8.js   145.23 kB │ gzip: 47.12 kB
✓ built in 3.21s
```

### 2.2 ビルド結果の確認

```powershell
# distフォルダの内容を確認
ls dist
```

**期待される構造**:
```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### 2.3 ローカルでビルド版をプレビュー

```powershell
npm run preview
```

ブラウザで `http://localhost:4173/ToDo/` を開き、アプリが正常に動作することを確認してください。

---

## 🚀 ステップ3: GitHub Pagesにデプロイ

### 方法A: 手動デプロイ（推奨・初回）

#### 3.1 gh-pages パッケージをインストール

```powershell
npm install --save-dev gh-pages
```

#### 3.2 package.json にデプロイスクリプトを追加

**場所**: `package.json`

**追加内容**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "deploy": "npm run build && gh-pages -d dist"  // ← 追加
  }
}
```

#### 3.3 デプロイ実行

```powershell
npm run deploy
```

**実行内容**:
1. `npm run build` - プロジェクトをビルド
2. `gh-pages -d dist` - `dist` フォルダを `gh-pages` ブランチにプッシュ

**期待される出力**:
```
> todo-app@1.0.0 deploy
> npm run build && gh-pages -d dist

> todo-app@1.0.0 build
> tsc && vite build

vite v4.2.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a1b2c3d4.css    2.35 kB │ gzip:  0.89 kB
dist/assets/index-e5f6g7h8.js   145.23 kB │ gzip: 47.12 kB
✓ built in 3.21s
Published
```

#### 3.4 GitHub Pages 設定を確認

1. GitHubリポジトリページに移動: `https://github.com/[ユーザー名]/ToDo`
2. **Settings** タブをクリック
3. 左サイドバーから **Pages** を選択
4. **Source** セクションで以下を確認:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. **Save** をクリック（既に設定済みなら不要）

#### 3.5 デプロイ完了を確認

数分後、以下のURLでアプリにアクセスできます:

```
https://[ユーザー名].github.io/ToDo/
```

---

### 方法B: GitHub Actions による自動デプロイ（上級者向け）

#### 3.1 ワークフローファイルを作成

**場所**: `.github/workflows/deploy.yml`

**内容**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # mainブランチにプッシュされたら実行

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 3.2 ワークフローをプッシュ

```powershell
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deploy workflow"
git push origin main
```

#### 3.3 デプロイ確認

1. GitHubリポジトリの **Actions** タブを開く
2. ワークフローの実行状況を確認
3. 緑色のチェックマークが表示されたら成功

---

## ✅ ステップ4: 動作検証

### 4.1 デプロイされたアプリを開く

ブラウザで以下のURLにアクセス:

```
https://[ユーザー名].github.io/ToDo/
```

### 4.2 機能テスト

以下の機能をテストしてください:

- [x] ホーム画面が表示される
- [x] サイドバーのページリンクをクリックできる
- [x] 新しいタスクを追加できる
- [x] タスクを完了状態にできる
- [x] タスクを削除できる
- [x] フィルター（全て/進行中/完了済み）が動作する
- [x] 新しいページを追加できる
- [x] ページを削除できる（タスクデータも削除される）
- [x] 日本語の入力・表示が正常に動作する

### 4.3 ブラウザの開発者ツールでエラーチェック

1. `F12` キーを押して開発者ツールを開く
2. **Console** タブを確認
3. エラーがないことを確認（404エラーやJavaScriptエラー）

---

## 🔧 トラブルシューティング

### ❌ 問題1: ページが表示されない（404 Not Found）

**症状**: `https://[ユーザー名].github.io/ToDo/` にアクセスすると 404 エラー

**原因**: GitHub Pages の設定が正しくない

**解決策**:
1. GitHubリポジトリ → **Settings** → **Pages**
2. **Source** を `gh-pages` ブランチ、`/ (root)` フォルダに設定
3. 数分待ってから再度アクセス

---

### ❌ 問題2: CSSやJavaScriptが読み込まれない

**症状**: ページは表示されるが、スタイルが崩れている

**原因**: `vite.config.ts` の `base` 設定が間違っている

**解決策**:
1. `vite.config.ts` の `base` を確認:
   ```typescript
   base: '/ToDo/',  // リポジトリ名と一致しているか？
   ```
2. リポジトリ名が `todo-app` なら:
   ```typescript
   base: '/todo-app/',
   ```
3. 再ビルド & デプロイ:
   ```powershell
   npm run deploy
   ```

---

### ❌ 問題3: ルーティングが動作しない

**症状**: `/TestUser` などのページに直接アクセスすると 404

**原因**: GitHub Pages は SPA（Single Page Application）のルーティングをサポートしていない

**解決策1: HashRouter を使用（推奨）**

`src/main.tsx` を修正:

```typescript
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>  {/* BrowserRouter → HashRouter に変更 */}
      <App />
    </HashRouter>
  </React.StrictMode>,
)
```

**URL例**: `https://[ユーザー名].github.io/ToDo/#/TestUser`

---

### ❌ 問題4: gh-pages コマンドが失敗する

**症状**: `npm run deploy` で以下のエラー:
```
fatal: A branch named 'gh-pages' already exists.
```

**解決策**:
```powershell
# gh-pages ブランチをリセット
git branch -D gh-pages
git push origin --delete gh-pages

# 再度デプロイ
npm run deploy
```

---

### ❌ 問題5: GitHub Actionsでテストが失敗する

**症状**: ワークフローの "Run tests" ステップが失敗

**原因**: CI環境でテストが正常に動作しない

**解決策**:

`vitest.config.ts` でCI環境用の設定を追加:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts',
    // CI環境用の設定を追加
    pool: 'forks',  // スレッド分離
    poolOptions: {
      forks: {
        singleFork: true  // 単一フォーク
      }
    }
  },
})
```

または、ワークフローでテストをスキップ:

```yaml
- name: Build
  run: npm run build
  # テストステップを削除またはコメントアウト
```

---

## 📊 デプロイ後のメンテナンス

### コードの更新とデプロイ

```powershell
# 1. コードを変更
git add .
git commit -m "Update feature X"
git push origin main

# 2. 手動デプロイの場合
npm run deploy

# 3. GitHub Actionsの場合は自動でデプロイされる
```

### ビルドサイズの確認

```powershell
npm run build

# dist フォルダのサイズを確認（PowerShell）
(Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

**推奨サイズ**: 1MB以下（圧縮後）

---

## 📚 参考リンク

- [Vite公式ドキュメント - Static Deploy](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [gh-pages npm パッケージ](https://www.npmjs.com/package/gh-pages)
- [React Router - Hash Router](https://reactrouter.com/en/main/router-components/hash-router)

---

## 🎉 まとめ

このガイドに従うことで、Todo AppをGitHub Pagesに正常にデプロイできます。

### チェックリスト

- [x] `vite.config.ts` の `base` 設定を追加
- [x] `BrowserRouter` の `basename` を設定
- [x] ローカルでビルドテスト
- [x] `gh-pages` パッケージをインストール
- [x] `npm run deploy` を実行
- [x] GitHub Pages設定を確認
- [x] デプロイされたアプリの動作確認

**デプロイ完了後のURL**:
```
https://[ユーザー名].github.io/ToDo/
```

---

**最終更新**: 2025年11月11日  
**バージョン**: 1.1  
**デプロイステータス**: ✅ 本番環境稼働中  
**公開URL**: https://j1921604.github.io/ToDo/
