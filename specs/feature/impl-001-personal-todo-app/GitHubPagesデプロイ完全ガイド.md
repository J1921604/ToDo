# GitHub Pages デプロイ完全ガイド (2025年版)

**プロジェクト**: React Todo App  
**リポジトリ**: https://github.com/J1921604/ToDo  
**デプロイURL**: https://j1921604.github.io/ToDo/  
**作成日**: 2025年11月14日

---

## 📋 目次

1. [自動デプロイ (推奨)](#自動デプロイ-推奨)
2. [手動デプロイ](#手動デプロイ)
3. [ローカル動作確認](#ローカル動作確認)
4. [トラブルシューティング](#トラブルシューティング)
5. [デプロイ後の確認](#デプロイ後の確認)

---

## 自動デプロイ (推奨)

GitHub Actionsを使用した自動デプロイ。mainブランチへのプッシュで自動的にビルド・デプロイが実行されます。

### 初回セットアップ

#### 1. GitHub Pages の有効化

GitHubリポジトリの設定ページで以下を設定:

```
https://github.com/J1921604/ToDo/settings/pages
```

- **Source**: GitHub Actions
- **Branch**: 設定不要 (GitHub Actionsが自動設定)

#### 2. ワークフローファイルの確認

`.github/workflows/deploy.yml` が存在することを確認:

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
```

#### 3. 初回デプロイの実行

mainブランチにプッシュ:

```powershell
# 変更をステージング
git add .

# コミット
git commit -m "Initial deployment to GitHub Pages"

# mainブランチにプッシュ (自動デプロイが開始される)
git push origin main
```

### デプロイの確認方法

#### GitHub Actions の状態確認

1. GitHubリポジトリの「Actions」タブを開く
2. 「Deploy to GitHub Pages」ワークフローを確認
3. ビルド・デプロイの進行状況を確認
4. ✅ 緑色のチェックマークが表示されれば成功

#### デプロイされたサイトへアクセス

約2-3分後、以下のURLでアクセス可能:

```
https://j1921604.github.io/ToDo/
```

### 更新時のデプロイ

コードを更新してmainブランチにプッシュするだけ:

```powershell
# 変更をコミット
git add .
git commit -m "Update application features"

# mainブランチにプッシュ → 自動デプロイ開始
git push origin main

# GitHub Actionsが以下を自動実行:
# 1. TypeScript型チェック (npm run type-check)
# 2. ビルド (npm run build)
# 3. GitHub Pagesへデプロイ
# 4. 約2-3分で反映完了
```

### 手動トリガー

コードを変更せずにデプロイを再実行したい場合:

1. リポジトリの「Actions」タブを開く
2. 「Deploy to GitHub Pages」ワークフローを選択
3. 「Run workflow」ボタンをクリック
4. ブランチ (main) を選択して「Run workflow」

---

## 手動デプロイ

GitHub Actionsが使用できない場合や、特殊な状況での手動デプロイ手順。

### 前提条件

- Node.js 18以上
- npm 9以上
- Git

### 手順

#### 1. ローカルでビルド

```powershell
# プロジェクトディレクトリに移動
cd c:\Users\J1921604\spec-kit\ToDo

# 依存関係のインストール (初回のみ)
npm install

# TypeScript型チェック
npm run type-check

# プロダクションビルド
npm run build
```

#### 2. ビルド結果の確認

```powershell
# プレビューサーバーで動作確認
npm run preview

# ブラウザで確認: http://localhost:4173/ToDo/
# - ページが正常に表示されることを確認
# - サイドバーのナビゲーションが動作することを確認
# - Todoの追加・削除・完了が動作することを確認
```

#### 3. GitHub Pagesブランチへプッシュ

```powershell
# gh-pagesブランチの作成 (初回のみ)
git checkout --orphan gh-pages

# 既存のファイルを削除
git rm -rf .

# ビルド成果物をコピー
Copy-Item -Path dist\* -Destination . -Recurse

# Gitに追加
git add .

# コミット
git commit -m "Manual deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# プッシュ
git push -f origin gh-pages

# mainブランチに戻る
git checkout main
```

#### 4. GitHub Pages設定の確認

リポジトリ設定 (`Settings` > `Pages`) で以下を確認:

- **Source**: Deploy from a branch
- **Branch**: gh-pages / (root)

約2-3分で https://j1921604.github.io/ToDo/ に反映されます。

---

## ローカル動作確認

デプロイ前にローカル環境で動作確認する手順。

### 開発サーバーでの確認

```powershell
# ワンコマンド起動スクリプト
.\start.ps1

# または手動起動
npm run dev

# ブラウザで確認: http://localhost:1234/
```

### プロダクションビルドでの確認

```powershell
# ビルド実行
npm run build

# プレビューサーバー起動
npm run preview

# ブラウザで確認: http://localhost:4173/ToDo/
# ※ プロダクション環境のbase path (/ToDo/) で動作確認
```

### 確認項目チェックリスト

✅ **基本機能**:
- [ ] ホームページが表示される
- [ ] サイドバーが表示される
- [ ] TestUserのTodoページが開ける

✅ **Todo機能**:
- [ ] タスクの追加ができる
- [ ] タスクの完了/未完了の切り替えができる
- [ ] タスクの削除ができる
- [ ] フィルター (すべて/未完了/完了) が動作する
- [ ] 完了タスクの一括削除ができる

✅ **ページ管理機能**:
- [ ] 新規ページの追加ができる
- [ ] ページ名の編集ができる
- [ ] ページの削除ができる
- [ ] ページ切り替えが動作する

✅ **データ永続化**:
- [ ] ページリロード後もタスクが残る
- [ ] ページリロード後も追加したページが残る
- [ ] ブラウザを閉じて再度開いてもデータが残る

---

## トラブルシューティング

### ❌ 404 Not Found

**症状**: GitHub Pagesにアクセスすると404エラーが表示される

**原因**: base pathの設定ミスまたはファイルパスが正しくない

**解決策**:

1. `vite.config.ts` の base path を確認:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ToDo/' : '/',
  // リポジトリ名と一致していることを確認
})
```

2. リポジトリ名を確認:
   - リポジトリ名: `ToDo` (大文字小文字を含む)
   - base path: `/ToDo/` (リポジトリ名と完全一致)

3. ビルドを再実行してプッシュ:

```powershell
npm run build
git add .
git commit -m "Fix base path configuration"
git push origin main
```

### ❌ デプロイが失敗する

**症状**: GitHub Actionsワークフローが赤色 (失敗) になる

**原因1**: TypeScript型エラー

**解決策**:

```powershell
# ローカルで型チェック実行
npm run type-check

# エラーが表示される場合は修正
# 型エラーを修正後、再度プッシュ
git add .
git commit -m "Fix TypeScript errors"
git push origin main
```

**原因2**: ビルドエラー

**解決策**:

```powershell
# ローカルでビルド実行
npm run build

# エラーが表示される場合は修正
# ビルドエラーを修正後、再度プッシュ
git add .
git commit -m "Fix build errors"
git push origin main
```

**原因3**: 依存関係のバージョン不整合

**解決策**:

```powershell
# node_modules を削除
Remove-Item -Recurse -Force node_modules

# package-lock.json を削除
Remove-Item package-lock.json

# 依存関係を再インストール
npm install

# ビルド確認
npm run build

# 問題なければコミット
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### ❌ 変更が反映されない

**症状**: コードを更新してプッシュしたが、サイトに反映されない

**原因1**: ブラウザキャッシュ

**解決策**:

1. ハードリロード:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. ブラウザキャッシュをクリア:
   - 開発者ツール (F12) を開く
   - Network タブを選択
   - "Disable cache" にチェック
   - ページをリロード

3. シークレットモード/プライベートブラウジングで確認

**原因2**: GitHub Actionsが実行されていない

**解決策**:

1. GitHub Actionsの状態を確認:
   - リポジトリの「Actions」タブを開く
   - 最新のワークフローが実行されているか確認
   - 実行されていない場合は手動トリガーを実行

2. ワークフローのログを確認:
   - 失敗しているステップがないか確認
   - エラーメッセージを確認して修正

### ❌ GitHub Actionsのワークフローが表示されない

**症状**: リポジトリの「Actions」タブにワークフローが表示されない

**原因**: ワークフローファイルがmainブランチに存在しない

**解決策**:

```powershell
# ワークフローファイルが存在するか確認
Get-ChildItem .github\workflows\

# 存在しない場合は作成
# (ファイルの内容は上記の「初回セットアップ」を参照)

# コミットしてプッシュ
git add .github\workflows\deploy.yml
git commit -m "Add GitHub Actions workflow for deployment"
git push origin main

# 約1分後、Actionsタブに表示される
```

### ❌ Permissions error

**症状**: GitHub Actionsで "Error: Resource not accessible by integration" が発生

**原因**: GitHub Pagesの権限設定が不足

**解決策**:

1. リポジトリ設定を開く: `Settings` > `Actions` > `General`
2. "Workflow permissions" セクションで以下を選択:
   - ✅ Read and write permissions
3. "Save" をクリック
4. ワークフローを再実行

---

## デプロイ後の確認

### 確認項目チェックリスト

✅ **デプロイ成功確認**:
- [ ] GitHub Actionsワークフローが成功している (緑色のチェックマーク)
- [ ] https://j1921604.github.io/ToDo/ でサイトが表示される
- [ ] コンソールエラーが表示されていない (F12で開発者ツールを開いて確認)

✅ **機能確認**:
- [ ] ホームページが正常に表示される
- [ ] サイドバーのナビゲーションが動作する
- [ ] TestUserのTodoページが開ける
- [ ] タスクの追加・削除・完了が動作する
- [ ] フィルター機能が動作する
- [ ] LocalStorageにデータが保存される
- [ ] ページリロード後もデータが残る
- [ ] 新規ページの追加が動作する
- [ ] ページ名の編集が動作する
- [ ] ページの削除が動作する

✅ **パフォーマンス確認**:
- [ ] ページロードが3秒以内に完了する
- [ ] タスク操作が即座に反映される
- [ ] ページ遷移がスムーズに動作する

✅ **モバイル確認** (オプション):
- [ ] スマートフォンで表示が崩れていない
- [ ] タッチ操作が正常に動作する

---

## 参考情報

### GitHub Actionsログの確認方法

1. リポジトリの「Actions」タブを開く
2. 該当のワークフロー実行をクリック
3. 「build」ジョブをクリックして詳細ログを表示
4. エラーがある場合は赤色で表示される
5. ログを展開してエラーメッセージを確認

### ビルド成果物の構造

```
dist/
├── index.html                # エントリーポイント
├── assets/
│   ├── index-[hash].js       # バンドルされたJavaScript
│   └── index-[hash].css      # バンドルされたCSS
└── (その他の静的ファイル)
```

### 環境変数

本プロジェクトでは環境変数は使用していません。すべての設定は `vite.config.ts` で管理されています。

### デプロイ時間

- **通常のデプロイ**: 2-3分
- **初回デプロイ**: 3-5分
- **大規模な変更**: 5-10分

### よくある質問 (FAQ)

**Q: 開発環境とプロダクション環境でbase pathが異なるのはなぜですか?**

A: 開発環境では `localhost:1234/` でアクセスしますが、GitHub Pagesでは `https://j1921604.github.io/ToDo/` でアクセスするため、プロダクション環境では `/ToDo/` というbase pathが必要になります。vite.config.tsで環境によって自動的に切り替わるように設定されています。

**Q: GitHub Actionsワークフローをスキップする方法はありますか?**

A: コミットメッセージに `[skip ci]` または `[ci skip]` を含めると、ワークフローがスキップされます:

```powershell
git commit -m "Update README [skip ci]"
```

ドキュメント更新など、デプロイが不要な変更の場合に使用します。

**Q: デプロイ前にテストを実行したい場合は?**

A: `.github/workflows/deploy.yml` の `build` ジョブに以下のステップを追加:

```yaml
- name: Run tests
  run: npm test
```

現在はテストが正常に動作しないため、コメントアウトされています。

**Q: 複数のブランチからデプロイしたい場合は?**

A: `.github/workflows/deploy.yml` の `on.push.branches` を修正:

```yaml
on:
  push:
    branches:
      - main
      - develop  # 追加のブランチ
```

ただし、GitHub Pagesは1つのブランチからのみデプロイ可能なため、通常はmainブランチのみを使用します。

**Q: カスタムドメインを使用できますか?**

A: 可能です。以下の手順で設定:

1. `public/` ディレクトリに `CNAME` ファイルを作成
2. ファイル内にカスタムドメイン (例: `todo.example.com`) を記述
3. DNSレコードでCNAMEを設定: `todo.example.com` → `j1921604.github.io`
4. リポジトリ設定の「Pages」セクションでカスタムドメインを入力
5. HTTPS を有効化

詳細は [GitHub Pagesカスタムドメインドキュメント](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site) を参照してください。

---

## まとめ

### 推奨デプロイ方法

✅ **自動デプロイ (GitHub Actions)** を使用:

- **メリット**:
  - mainブランチへのプッシュで自動デプロイ
  - TypeScript型チェックとビルドが自動実行
  - デプロイ履歴が残る
  - エラー時に即座に通知される
  
- **デプロイURL**: https://j1921604.github.io/ToDo/
- **更新時間**: 約2-3分で反映
- **操作**: `git push origin main` のみ

### 手動デプロイが必要な場合

以下のような特殊な状況でのみ手動デプロイを使用:

- GitHub Actionsが一時的に使用できない
- 緊急の修正が必要で、自動デプロイを待てない
- GitHub Actionsの設定を変更中

通常は自動デプロイを使用することを強く推奨します。

---

**最終更新**: 2025年11月14日  
**バージョン**: 1.0.0
