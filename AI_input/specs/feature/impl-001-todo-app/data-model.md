# データモデル仕様: Todo App

**作成日**: 2025-11-13  
**プロジェクト**: Todo App - template-no-delete.tsx ベースアプリケーション  
**目的**: エンティティ定義、フィールド、関係性、バリデーションルール、状態遷移を文書化

---

## 関連ドキュメント

| ドキュメント | 参照先 | 関連セクション |
|------------|--------|-------------|
| 実装計画 | [plan.md](./plan.md) | プロジェクト構造、制約条件 |
| 技術調査 | [research.md](./research.md) | TypeScript、LocalStorage、React Hooks |
| 開発ガイド | [quickstart.md](./quickstart.md) | コーディング規約、テスト実行 |
| 機能仕様書 | [spec.md](../001-todo-app-spec/spec.md) | データフロー図、成功基準 |

**技術スタック**:
- TypeScript 4.9.3: [research.md#2-typescript-493](./research.md#2-typescript-493型安全性)
- LocalStorage: [research.md#5-localstorage](./research.md#5-localstorageデータ永続化)
- React Hooks: [research.md#1-react-1820--hooks](./research.md#1-react-1820--hooks状態管理)

---

## 概要

Todo Appは3つの主要エンティティで構成されます：

1. **TodoItem**: 個別のタスクを表現
2. **UserPage**: ユーザーごとのTodoページを表現
3. **StorageKey**: LocalStorageのキー命名規則

LocalStorageベースのクライアントサイドアプリケーションのため、リレーショナルデータベースは使用せず、JSON形式でデータを永続化します。

---

## エンティティ定義

### 1. TodoItem（タスクアイテム）

**用途**: 個別のタスクを表現するコアエンティティ

#### TypeScript型定義

```typescript
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string; // ISO 8601形式
}
```

#### フィールド詳細

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|-----|-----|------|-----|
| `id` | `number` | ✅ | 一意識別子 | `Date.now()`によるタイムスタンプ、正の整数 |
| `text` | `string` | ✅ | タスク内容 | 1〜500文字、trim後空文字列禁止 |
| `completed` | `boolean` | ✅ | 完了状態 | `true`（完了）または `false`（未完了） |
| `createdAt` | `string` | ✅ | 作成日時 | ISO 8601形式（例: "2025-11-13T10:30:00.000Z"） |

#### バリデーションルール

```typescript
function validateTodoItem(item: unknown): item is TodoItem {
  if (typeof item !== 'object' || item === null) return false;
  
  const todo = item as Record<string, unknown>;
  
  // id: 正の整数
  if (typeof todo.id !== 'number' || !Number.isInteger(todo.id) || todo.id <= 0) {
    return false;
  }
  
  // text: 1〜500文字
  if (typeof todo.text !== 'string' || todo.text.trim().length === 0) {
    return false;
  }
  if (todo.text.length > 500) {
    return false;
  }
  
  // completed: boolean
  if (typeof todo.completed !== 'boolean') {
    return false;
  }
  
  // createdAt: ISO 8601形式
  if (typeof todo.createdAt !== 'string') {
    return false;
  }
  const date = new Date(todo.createdAt);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  return true;
}
```

#### 状態遷移

```mermaid
stateDiagram-v2
    [*] --> 作成中: addTodo()
    作成中 --> 未完了: text入力 & 追加ボタン
    未完了 --> 完了済み: toggleTodo(id)
    完了済み --> 未完了: toggleTodo(id)
    未完了 --> [*]: deleteTodo(id)
    完了済み --> [*]: deleteTodo(id)
    完了済み --> [*]: clearCompleted()
    
    note right of 未完了
        completed: false
        スタイル: 通常テキスト
    end note
    
    note right of 完了済み
        completed: true
        スタイル: 取り消し線
    end note
```

#### 永続化形式

LocalStorageには以下のJSON配列として保存：

```json
[
  {
    "id": 1699876543210,
    "text": "Reactの学習",
    "completed": false,
    "createdAt": "2025-11-13T01:22:23.210Z"
  },
  {
    "id": 1699876600000,
    "text": "TypeScriptの学習",
    "completed": true,
    "createdAt": "2025-11-13T01:23:20.000Z"
  }
]
```

---

### 2. UserPage（ユーザーページ）

**用途**: ユーザーごとのTodoページ設定を表現

#### TypeScript型定義

```typescript
interface UserPage {
  name: string;
  icon: string;
  path: string;
  component: React.ComponentType;
}
```

#### フィールド詳細

| フィールド | 型 | 必須 | 説明 | 制約 |
|-----------|-----|-----|------|-----|
| `name` | `string` | ✅ | ページ名（日本語対応） | 1〜50文字、重複禁止、trim後空文字列禁止 |
| `icon` | `string` | ✅ | 絵文字アイコン | 1文字の絵文字、デフォルト "📝" |
| `path` | `string` | ✅ | ルーティングパス | `/`開始、英数字とハイフン、重複禁止 |
| `component` | `React.ComponentType` | ✅ | Reactコンポーネント | 有効なReactコンポーネント |

#### バリデーションルール

```typescript
function validateUserPage(page: unknown): page is Omit<UserPage, 'component'> {
  if (typeof page !== 'object' || page === null) return false;
  
  const p = page as Record<string, unknown>;
  
  // name: 1〜50文字
  if (typeof p.name !== 'string' || p.name.trim().length === 0) {
    return false;
  }
  if (p.name.length > 50) {
    return false;
  }
  
  // icon: 1文字の絵文字
  if (typeof p.icon !== 'string' || p.icon.length === 0) {
    return false;
  }
  
  // path: /開始、有効なパス
  if (typeof p.path !== 'string' || !p.path.startsWith('/')) {
    return false;
  }
  if (!/^\/[a-zA-Z0-9-]+$/.test(p.path)) {
    return false;
  }
  
  return true;
}
```

#### 設定ファイル形式

`src/config/userPages.ts`に以下の形式で定義：

```typescript
import { DynamicTodoPage } from '../pages/DynamicTodoPage';

export const userPages: UserPage[] = [
  {
    name: '浜崎秀寿',
    icon: '📝',
    path: '/hamasaki-todo',
    component: DynamicTodoPage
  },
  {
    name: 'TestUser',
    icon: '✅',
    path: '/testuser-todo',
    component: DynamicTodoPage
  }
];
```

#### ページライフサイクル

```mermaid
stateDiagram-v2
    [*] --> 作成中: サイドバー「➕新規ページ追加」
    作成中 --> 保存待ち: 名前入力
    保存待ち --> サーバー再起動: userPages.ts編集
    サーバー再起動 --> アクティブ: ページ表示
    アクティブ --> 編集中: ✏️ボタン
    編集中 --> サーバー再起動: 名前変更保存
    アクティブ --> 削除確認: 🗑️ボタン
    削除確認 --> 削除処理: 確認ダイアログOK
    削除処理 --> [*]: userPages.ts削除 & LocalStorage削除
    
    note right of サーバー再起動
        開発サーバーの再起動が必要
        （ホットリロード未対応）
    end note
    
    note right of 削除処理
        - userPages.tsからエントリ削除
        - LocalStorageキー削除
        - データ復元不可
    end note
```

---

### 3. StorageKey（ストレージキー）

**用途**: LocalStorageのキー命名規則を標準化

#### 命名パターン

```typescript
type StorageKeyPattern = `${string}-todos`;

// 例
const key1: StorageKeyPattern = '浜崎秀寿-todos';
const key2: StorageKeyPattern = 'TestUser-todos';
const key3: StorageKeyPattern = 'page-info'; // メタデータ用
```

#### キー生成関数

```typescript
function getTodosKey(pageName: string): string {
  // エスケープ処理（特殊文字対策）
  const safeName = pageName.trim();
  return `${safeName}-todos`;
}

function getPageInfoKey(): string {
  return 'page-info';
}
```

#### LocalStorage構造

```json
{
  "浜崎秀寿-todos": "[{\"id\":1699876543210,\"text\":\"Reactの学習\",\"completed\":false,\"createdAt\":\"2025-11-13T01:22:23.210Z\"}]",
  "TestUser-todos": "[{\"id\":1699876600000,\"text\":\"TypeScriptの学習\",\"completed\":true,\"createdAt\":\"2025-11-13T01:23:20.000Z\"}]",
  "page-info": "{\"version\":\"1.0\",\"lastUpdated\":\"2025-11-13T10:00:00.000Z\"}"
}
```

#### クリーンアップルール

```typescript
function cleanupPageData(pageName: string): void {
  const key = getTodosKey(pageName);
  
  // LocalStorageからキー削除
  localStorage.removeItem(key);
  
  // userPages.tsから手動削除（サーバー再起動必要）
  // ※ 自動化は将来的な改善課題
}
```

---

## エンティティ関係図

```mermaid
erDiagram
    UserPage ||--o{ TodoItem : "has many"
    UserPage ||--|| StorageKey : "generates"
    
    UserPage {
        string name PK
        string icon
        string path
        ComponentType component
    }
    
    TodoItem {
        number id PK
        string text
        boolean completed
        string createdAt
    }
    
    StorageKey {
        string pattern "name-todos"
    }
```

**関係性**:
- 1つの`UserPage`は複数の`TodoItem`を持つ（1対多）
- 1つの`UserPage`は1つの`StorageKey`を生成する（1対1）
- `TodoItem`はLocalStorageに`StorageKey`で保存される

---

## FilterType（フィルタータイプ）

**用途**: タスク表示フィルターを制御

#### TypeScript型定義

```typescript
type FilterType = 'all' | 'active' | 'completed';
```

#### フィルター動作

```mermaid
flowchart TB
    A[TodoItem配列] --> B{filter状態}
    B -->|'all'| C[全タスク表示]
    B -->|'active'| D[completed=false のみ]
    B -->|'completed'| E[completed=true のみ]
    
    C --> F[レンダリング]
    D --> F
    E --> F
    
    style B fill:#e1f5ff
    style C fill:#e1ffe1
    style D fill:#fff4e1
    style E fill:#ffe1f5
```

#### フィルター関数

```typescript
function filterTodos(todos: TodoItem[], filter: FilterType): TodoItem[] {
  switch (filter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
```

---

## データ整合性ルール

### 1. ID一意性保証

```typescript
function generateTodoId(existingTodos: TodoItem[]): number {
  const now = Date.now();
  const ids = new Set(existingTodos.map(todo => todo.id));
  
  // 同時追加でIDが重複する場合、+1
  let id = now;
  while (ids.has(id)) {
    id++;
  }
  
  return id;
}
```

### 2. LocalStorage同期

```typescript
// useEffectで自動同期
useEffect(() => {
  const key = getTodosKey(pageName);
  localStorage.setItem(key, JSON.stringify(todos));
}, [todos, pageName]);

// ページロード時に復元
useEffect(() => {
  const key = getTodosKey(pageName);
  const saved = localStorage.getItem(key);
  
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const validated = parsed.filter(validateTodoItem);
        setTodos(validated);
      }
    } catch (error) {
      console.error('LocalStorageデータ破損', error);
      setTodos([]);
    }
  }
}, [pageName]);
```

### 3. ページ名重複チェック

```typescript
function isPageNameUnique(name: string, existingPages: UserPage[]): boolean {
  return !existingPages.some(page => page.name === name);
}
```

---

## パフォーマンス考慮事項

### 1. LocalStorage容量管理

```typescript
function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total; // bytes
}

const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

function checkStorageCapacity(): boolean {
  return getStorageSize() < STORAGE_LIMIT * 0.9; // 90%で警告
}
```

### 2. 大量タスク対策

```typescript
// 10,000タスクでもフィルタリング < 1秒を保証
function efficientFilter(todos: TodoItem[], filter: FilterType): TodoItem[] {
  if (todos.length > 1000) {
    // 大量データ時はメモ化を活用
    return useMemo(() => filterTodos(todos, filter), [todos, filter]);
  }
  return filterTodos(todos, filter);
}
```

---

## エンティティ概要図

```mermaid
flowchart TB
    subgraph UserPages["ユーザーページ"]
        UP1[UserPage 1<br/>浜崎秀寿<br/>📝]
        UP2[UserPage 2<br/>TestUser<br/>✅]
        UP3[UserPage 3<br/>山田太郎<br/>📋]
    end
    
    subgraph Storage["LocalStorage"]
        SK1["浜崎秀寿-todos"]
        SK2["TestUser-todos"]
        SK3["山田太郎-todos"]
    end
    
    subgraph TodoData["Todoデータ"]
        T1["TodoItem[]<br/>JSON配列"]
        T2["TodoItem[]<br/>JSON配列"]
        T3["TodoItem[]<br/>JSON配列"]
    end
    
    UP1 -->|generates| SK1
    UP2 -->|generates| SK2
    UP3 -->|generates| SK3
    
    SK1 -->|stores| T1
    SK2 -->|stores| T2
    SK3 -->|stores| T3
    
    T1 -->|contains| TI1["TodoItem<br/>id: 1<br/>text: 'Task'<br/>completed: false"]
    T1 -->|contains| TI2["TodoItem<br/>id: 2<br/>text: 'Done'<br/>completed: true"]
    
    style UserPages fill:#e3f2fd
    style Storage fill:#fff3e0
    style TodoData fill:#f3e5f5
```

---

## データ変換フロー

```mermaid
flowchart LR
    A[ユーザー入力<br/>'新しいタスク'] --> B[sanitizeTaskText]
    B --> C[generateTodoId]
    C --> D[TodoItem作成]
    D --> E[バリデーション<br/>validateTodoItem]
    E -->|合格| F[todos配列追加]
    E -->|不合格| G[エラー表示]
    F --> H[JSON.stringify]
    H --> I[LocalStorage保存]
    
    I2[LocalStorage読込] --> J[JSON.parse]
    J --> K[配列型チェック]
    K --> L[validateTodoItem]
    L -->|合格| M[State復元]
    L -->|不合格| N[スキップ]
    
    style B fill:#fff4e6
    style E fill:#ffe6e6
    style L fill:#ffe6e6
    style F fill:#e1ffe1
    style M fill:#e1ffe1
```

---

## セキュリティ考慮事項

### 1. XSS対策

```typescript
// Reactのデフォルトエスケープに依存
function TaskItem({ todo }: { todo: TodoItem }) {
  return (
    <div>
      {/* 自動エスケープされる */}
      <span>{todo.text}</span>
      
      {/* 危険: 使用禁止 */}
      {/* <span dangerouslySetInnerHTML={{ __html: todo.text }} /> */}
    </div>
  );
}
```

### 2. 入力サニタイゼーション

```typescript
function sanitizeTaskText(text: string): string {
  return text
    .trim()
    .slice(0, 500) // 最大500文字
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // 制御文字削除
}

// タスク追加時
function addTodo(text: string): TodoItem | null {
  const sanitized = sanitizeTaskText(text);
  
  if (sanitized.length === 0) {
    return null; // 空文字列は拒否
  }
  
  return {
    id: generateTodoId(todos),
    text: sanitized,
    completed: false,
    createdAt: new Date().toISOString()
  };
}
```

### 3. LocalStorage容量監視

```typescript
function monitorStorageUsage(): void {
  const usage = getStorageSize();
  const limit = STORAGE_LIMIT;
  const percentage = (usage / limit) * 100;
  
  if (percentage > 90) {
    console.warn(`LocalStorage使用率: ${percentage.toFixed(1)}%（警告閾値: 90%）`);
    // ユーザーに警告表示
    alert('ストレージ容量が不足しています。古いデータを削除してください。');
  }
}
```

### 4. データ破損対応

```typescript
function safeLoadTodos(key: string): TodoItem[] {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.error('LocalStorageデータ形式エラー: 配列でない');
      return [];
    }
    
    const validated = parsed.filter(validateTodoItem);
    
    if (validated.length !== parsed.length) {
      console.warn(`不正なデータ ${parsed.length - validated.length}件をスキップ`);
    }
    
    return validated;
  } catch (error) {
    console.error('LocalStorageデータ読み込みエラー', error);
    return [];
  }
}
```

---

## エッジケース対応

### 1. ID重複（高速連続追加）

**問題**: `Date.now()`は1msの精度のため、高速連続追加でID重複の可能性

**対策**:
```typescript
function generateTodoId(existingTodos: TodoItem[]): number {
  const now = Date.now();
  const ids = new Set(existingTodos.map(todo => todo.id));
  
  let id = now;
  let retries = 0;
  const MAX_RETRIES = 100;
  
  while (ids.has(id) && retries < MAX_RETRIES) {
    id++;
    retries++;
  }
  
  if (retries >= MAX_RETRIES) {
    throw new Error('ID生成失敗: 重複が解消できません');
  }
  
  return id;
}
```

### 2. LocalStorage容量超過

**問題**: 5MB制限を超えた場合、`QuotaExceededError`が発生

**対策**:
```typescript
function saveToLocalStorage(key: string, data: TodoItem[]): boolean {
  try {
    const json = JSON.stringify(data);
    
    // 事前容量チェック
    const estimatedSize = json.length + key.length;
    if (getStorageSize() + estimatedSize > STORAGE_LIMIT) {
      throw new Error('容量超過: 古いデータを削除してください');
    }
    
    localStorage.setItem(key, json);
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('LocalStorage容量超過');
      alert('ストレージ容量を超えました。不要なタスクを削除してください。');
    } else {
      console.error('LocalStorage保存エラー', e);
    }
    return false;
  }
}
```

### 3. プライベートブラウジングモード

**問題**: プライベートモードではLocalStorageが無効化される場合がある

**対策**:
```typescript
function checkLocalStorageAvailability(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('LocalStorageが使用できません', e);
    alert('プライベートブラウジングモードではアプリが正常に動作しません。通常モードで開いてください。');
    return false;
  }
}

// アプリ起動時にチェック
if (!checkLocalStorageAvailability()) {
  // フォールバック: メモリ内状態管理のみ
  console.warn('メモリ内状態管理にフォールバック（永続化なし）');
}
```

### 4. ページ削除後のゴーストデータ

**問題**: ページ削除後もLocalStorageにデータが残る

**対策**:
```typescript
function deletePageCompletely(pageName: string): void {
  // 1. userPages.tsから削除（手動操作）
  console.log(`userPages.tsから ${pageName} を削除してください`);
  
  // 2. LocalStorageキー削除
  const key = getTodosKey(pageName);
  localStorage.removeItem(key);
  
  // 3. 削除履歴記録（将来的な復元防止）
  const deletedPages = JSON.parse(localStorage.getItem('deleted-pages') || '[]');
  deletedPages.push({ name: pageName, deletedAt: new Date().toISOString() });
  localStorage.setItem('deleted-pages', JSON.stringify(deletedPages));
  
  console.log(`ページ "${pageName}" を完全削除しました`);
}

// 定期的なゴーストデータクリーンアップ
function cleanupGhostData(): void {
  const validPageNames = userPages.map(page => page.name);
  
  for (const key in localStorage) {
    if (key.endsWith('-todos')) {
      const pageName = key.replace('-todos', '');
      if (!validPageNames.includes(pageName)) {
        console.warn(`ゴーストデータ検出: ${key}`);
        localStorage.removeItem(key);
      }
    }
  }
}
```

### 5. 大量タスク（10,000件）のレンダリング

**問題**: 10,000タスクの一括レンダリングはUIをフリーズさせる

**対策**:
```typescript
import { useMemo } from 'react';

function TodoList({ todos, filter }: { todos: TodoItem[], filter: FilterType }) {
  // フィルタリング結果をメモ化
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter]);
  
  // 仮想スクロール（react-windowなど）の導入を検討
  if (filteredTodos.length > 1000) {
    console.warn('大量タスク検出: 仮想スクロール推奨');
  }
  
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TaskItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## パフォーマンス最適化詳細

### 1. メモ化戦略

```typescript
import { useMemo, useCallback } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // フィルター結果のメモ化
  const filteredTodos = useMemo(() => {
    console.log('フィルタリング実行');
    return filterTodos(todos, filter);
  }, [todos, filter]);
  
  // コールバックのメモ化
  const handleToggle = useCallback((id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);
  
  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  return <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} />;
}
```

### 2. 差分更新

```typescript
// 全体更新を避け、差分のみ更新
function updateTodoEfficiently(id: number, updates: Partial<TodoItem>) {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? { ...todo, ...updates } : todo
  ));
}

// Bad: 全体コピー
function updateTodoInefficient(id: number, updates: Partial<TodoItem>) {
  const updated = todos.map(todo => 
    todo.id === id ? { ...todo, ...updates } : { ...todo }  // すべてコピー
  );
  setTodos(updated);
}
```

### 3. LocalStorage書き込み頻度制限

```typescript
import { useEffect, useRef } from 'react';

function useDebouncedLocalStorage(key: string, value: any, delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 新しいタイマーを設定
    timeoutRef.current = setTimeout(() => {
      console.log('LocalStorageに保存');
      localStorage.setItem(key, JSON.stringify(value));
    }, delay);
    
    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, value, delay]);
}

// 使用例
function TodoPage({ pageName }: { pageName: string }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const key = getTodosKey(pageName);
  
  // 500ms後にまとめて保存（連続変更時のパフォーマンス向上）
  useDebouncedLocalStorage(key, todos, 500);
  
  return <TodoList todos={todos} />;
}
```

---

## バリデーション詳細仕様

### TodoItemバリデーション拡張

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateTodoItemExtended(item: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (typeof item !== 'object' || item === null) {
    return { isValid: false, errors: ['データ型が不正です'] };
  }
  
  const todo = item as Record<string, unknown>;
  
  // ID検証
  if (typeof todo.id !== 'number') {
    errors.push('IDは数値である必要があります');
  } else if (!Number.isInteger(todo.id)) {
    errors.push('IDは整数である必要があります');
  } else if (todo.id <= 0) {
    errors.push('IDは正の整数である必要があります');
  }
  
  // text検証
  if (typeof todo.text !== 'string') {
    errors.push('テキストは文字列である必要があります');
  } else {
    const trimmed = todo.text.trim();
    if (trimmed.length === 0) {
      errors.push('テキストは空白のみであってはいけません');
    }
    if (todo.text.length > 500) {
      errors.push('テキストは500文字以内である必要があります');
    }
  }
  
  // completed検証
  if (typeof todo.completed !== 'boolean') {
    errors.push('完了状態はboolean型である必要があります');
  }
  
  // createdAt検証
  if (typeof todo.createdAt !== 'string') {
    errors.push('作成日時は文字列である必要があります');
  } else {
    const date = new Date(todo.createdAt);
    if (isNaN(date.getTime())) {
      errors.push('作成日時は有効なISO 8601形式である必要があります');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---
