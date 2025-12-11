# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**憲法準拠チェック** (Todo App憲法 v1.1.0に基づく):

- [ ] **I. テスト駆動開発（必須・非交渉）**
  - [ ] すべての機能実装前にテストを作成する計画が含まれているか
  - [ ] Red-Green-Refactorサイクルを遵守する実装順序が定義されているか
  - [ ] 106テスト・100%カバレッジ目標が設定されているか
  - [ ] 仕様に対する検証テストが必須として計画されているか

- [ ] **II. セキュリティファースト**
  - [ ] 機密データの平文保存が禁止されているか
  - [ ] すべての機密データが暗号化またはハッシュ化されているか
  - [ ] セキュリティレビューなしにデプロイしない手順が定義されているか

- [ ] **III. パフォーマンス基準の定量化**
  - [ ] すべてのパフォーマンス要件が定量的な閾値で定義されているか
  - [ ] パフォーマンス閾値が受入基準に組み込まれているか
  - [ ] レスポンスタイム、メモリ使用量、処理速度の具体的な数値が設定されているか

- [ ] **IV. ユーザー体験の一貫性**
  - [ ] UIコンポーネントが再利用可能な形で設計されているか
  - [ ] デザインシステムまたはコンポーネントライブラリに従っているか
  - [ ] アクセシビリティ基準（ARIA属性、キーボード操作等）を満たしているか
  - [ ] レスポンシブデザインが実装されているか

- [ ] **V. コード品質と可読性**
  - [ ] コードレビューを経ずにmainブランチへマージしない手順が定義されているか
  - [ ] リンター・フォーマッター警告の解決が必須とされているか
  - [ ] TypeScript厳格モードが有効になっているか
  - [ ] 複雑な処理に適切なコメントとドキュメントを追加する計画があるか

- [ ] **制約事項チェック**
  - [ ] 外部依存はバージョン固定されているか（`^`, `~`使用禁止）
  - [ ] 仕様書との整合性が確保されているか
  - [ ] LocalStorage APIをユーティリティ関数経由で使用しているか

- [ ] **開発方針チェック**
  - [ ] Python 3.10.11実行環境（`py -3.10`）が使用されているか
  - [ ] ローカルでビルドとプレビューを検証する手順が含まれているか
  - [ ] ワンコマンド開発環境セットアップ（start.ps1）が提供されているか
  - [ ] Mermaid v11構文に準拠した図が使用されているか
  - [ ] ガントチャートで土日と年末年始（12/27-1/4）を除外しているか

- [ ] **品質保証チェック**
  - [ ] すべてのドキュメントが日本語で記述されているか（英語部分が削除されているか）
  - [ ] リンクがGitHubリポジトリURL（https://github.com/J1921604/ToDo）を使用しているか
  - [ ] バージョンと日付が統一されているか（v1.0.0, 2025-11-20）
  - [ ] UTF-8エンコーディング（BOMなし）が使用されているか

**違反がある場合は、Complexity Trackingセクションで正当化すること**

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
