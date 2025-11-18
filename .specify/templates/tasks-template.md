---

description: "機能実装のためのタスクリストテンプレート"
---

# タスク: [FEATURE NAME]

**入力**: `/specs/[###-feature-name]/`のデザインドキュメント
**前提条件**: plan.md（必須）、spec.md（ユーザーストーリー用に必須）、research.md、data-model.md、contracts/

**テスト**: 以下の例にはテストタスクが含まれています。テストはオプションです - 機能仕様書で明示的に要求された場合のみ含めてください。

**構成**: タスクはユーザーストーリーごとにグループ化され、各ストーリーの独立した実装とテストを可能にします。

## 形式: `[ID] [P?] [Story] 説明`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（例: US1、US2、US3）
- 説明に正確なファイルパスを含める

## パス規約

- **単一プロジェクト**: リポジトリルートに`src/`、`tests/`
- **Webアプリ**: `backend/src/`、`frontend/src/`
- **モバイル**: `api/src/`、`ios/src/`または`android/src/`
- 以下に示すパスは単一プロジェクトを前提 - plan.mdの構造に基づいて調整

<!-- 
  ============================================================================
  重要: 以下のタスクは説明目的のサンプルタスクです。
  
  /speckit.tasksコマンドは、以下に基づいて実際のタスクに置き換える必要があります:
  - spec.mdからのユーザーストーリー（優先度P1、P2、P3...付き）
  - plan.mdからの機能要件
  - data-model.mdからのエンティティ
  - contracts/からのエンドポイント
  
  タスクは、各ストーリーが以下を可能にするようにユーザーストーリーごとに整理される必要があります:
  - 独立して実装可能
  - 独立してテスト可能
  - MVPインクリメントとして提供可能
  
  生成されたtasks.mdファイルでは、これらのサンプルタスクを保持しないでください。
  ============================================================================
-->

## フェーズ1: セットアップ（共有インフラストラクチャ）

**目的**: プロジェクトの初期化と基本構造

- [ ] T001 実装計画に従ってプロジェクト構造を作成
- [ ] T002 [framework]依存関係を使用して[language]プロジェクトを初期化
- [ ] T003 [P] リンターとフォーマッターツールを設定

---

## フェーズ2: 基盤（ブロッキング前提条件）

**目的**: すべてのユーザーストーリーを実装する前に完了しなければならないコアインフラストラクチャ

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業を開始できません

基盤タスクの例（プロジェクトに基づいて調整）:

- [ ] T004 データベーススキーマとマイグレーションフレームワークをセットアップ
- [ ] T005 [P] 認証/認可フレームワークを実装
- [ ] T006 [P] APIルーティングとミドルウェア構造をセットアップ
- [ ] T007 すべてのストーリーが依存する基本モデル/エンティティを作成
- [ ] T008 エラーハンドリングとロギングインフラストラクチャを設定
- [ ] T009 環境設定管理をセットアップ

**チェックポイント**: 基盤が準備完了 - ユーザーストーリーの実装を並列で開始可能

---

## フェーズ3: ユーザーストーリー1 - [タイトル] (優先度: P1) 🎯 MVP

**目標**: [このストーリーが提供するものの簡潔な説明]

**独立テスト**: [このストーリーが単独で機能することを検証する方法]

### ユーザーストーリー1のテスト（オプション - テストが要求された場合のみ） ⚠️

> **注記: これらのテストを最初に記述し、実装前に失敗することを確認してください**

- [ ] T010 [P] [US1] tests/contract/test_[name].pyに[endpoint]のコントラクトテスト
- [ ] T011 [P] [US1] tests/integration/test_[name].pyに[user journey]の統合テスト

### ユーザーストーリー1の実装

- [ ] T012 [P] [US1] src/models/[entity1].pyに[Entity1]モデルを作成
- [ ] T013 [P] [US1] src/models/[entity2].pyに[Entity2]モデルを作成
- [ ] T014 [US1] src/services/[service].pyに[Service]を実装（T012、T013に依存）
- [ ] T015 [US1] src/[location]/[file].pyに[endpoint/feature]を実装
- [ ] T016 [US1] バリデーションとエラーハンドリングを追加
- [ ] T017 [US1] ユーザーストーリー1の操作用ロギングを追加

**チェックポイント**: この時点で、ユーザーストーリー1は完全に機能し、独立してテスト可能であるべき

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
