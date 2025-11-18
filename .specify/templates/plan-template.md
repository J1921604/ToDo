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

*必須: Phase 0調査開始前に検証。Phase 1設計完了後に再確認。*

以下の憲法原則への準拠を確認してください:

**I. テスト駆動開発（必須・非交渉）**
- [ ] すべての機能実装前にテストを作成する計画が含まれているか
- [ ] Red-Green-Refactorサイクルの適用計画があるか
- [ ] 仕様に対する検証テストが定義されているか

**II. セキュリティファースト**
- [ ] 機密データを扱う場合、暗号化またはハッシュ化の計画があるか
- [ ] セキュリティレビュー手順が含まれているか
- [ ] 平文での機密データ保存が排除されているか

**III. パフォーマンス基準の定量化**
- [ ] パフォーマンス要件が定量的な閾値で定義されているか（レスポンスタイム、メモリ使用量等）
- [ ] パフォーマンステストの計画が含まれているか
- [ ] 受入基準にパフォーマンス閾値が組み込まれているか

**IV. ユーザー体験の一貫性**
- [ ] UIコンポーネントは再利用可能な設計になっているか
- [ ] アクセシビリティ基準（ARIA属性等）への準拠計画があるか
- [ ] レスポンシブデザインの実装計画があるか

**V. コード品質と可読性**
- [ ] コードレビュープロセスが定義されているか
- [ ] TypeScript厳格モードの使用が計画されているか
- [ ] リンター・フォーマッターの設定が含まれているか

**制約事項**
- [ ] 外部依存のバージョンが固定されているか（曖昧なバージョン指定を避ける）
- [ ] 仕様書との整合性が保たれているか
- [ ] データ永続化にLocalStorage APIを使用し、ユーティリティ関数経由でアクセスする計画か

**ガバナンス**
- [ ] ブランチ戦略（仕様ブランチ→実装ブランチ）に従っているか
- [ ] 開発ワークフロー（憲法→仕様→計画→タスク→検証→実装→レビュー）を遵守しているか
- [ ] Mermaid v11構文に準拠した図が含まれているか（必要な場合）

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
