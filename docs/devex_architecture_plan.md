# 開發體驗與架構優化實作計畫 (DevEx & Architecture Implementation Plan)

本文件詳細說明以下五項架構與開發體驗優化功能的實作規劃：

1. **架構模組化 (Monorepo Refactoring)**
2. **架構決策記錄 (ADR)**
3. **設計系統文件化 (Storybook)**
4. **架構分層強制檢測 (Dependency Cruiser)**
5. **複雜度監控 (Cognitive Complexity)**

---

## 1. 架構模組化 (Monorepo Refactoring) `[V3]`

### 目標

隨著專案擴大，將核心業務邏輯 (`core`) 與 UI 層 (`ui`) 實體分離，確保 `apps/web` 與 `apps/functions` (甚至未來的 `apps/admin`) 能共用邏輯而不互相耦合。

### 架構設計

* **packages/core**: 純 TypeScript 邏輯 (Models, Services, Utils, Zod Schemas)。不依賴 Vue/React。
* **packages/ui-kit**: 通用 UI 元件庫 (Buttons, Inputs, Cards)。依賴 Vue + Tailwind。
* **apps/web**: 僅包含 Page Views 與 App-specific 邏輯 (Store 組合 Service)。
* **apps/functions**: 後端 API，僅依賴 `packages/core`。

### 實作步驟

1. **建立 `packages/ui-kit`**:

    ```bash
    mkdir -p packages/ui-kit
    cd packages/ui-kit && pnpm init
    ```

    * 移入 `apps/web/src/components/common` 下的通用元件。
    * 設定 `vite.config.ts` (Library Mode) 與 `package.json` exports。
2. **重構 `packages/core`**:
    * 確保 `core` 內無任何前端特定依賴 (如 `vue-router`)。
    * 將 `apps/web/src/services` 中剩餘的通用邏輯全數遷移至 `core`。
3. **調整依賴**:
    * `apps/web` 安裝 `@subscription-buddy/ui-kit`。
    * `apps/web` 移除本地 components 引用，改從 package import。

---

## 2. 架構決策記錄 (Architecture Decision Records - ADR) `[P2]`

### 目標

記錄重大技術決策的背景 (Context)、選項 (Options)、決策 (Decision) 與後果 (Consequences)，避免團隊成員重複辯論已決定的議題 (Core Rules 9.5)。

### 規範與工具

* **格式**: Markdown (MADR Template)。
* **工具**: `adr-tools` (CLI) 或手動維護。
* **位置**: `docs/adr/`。

### 實作步驟

1. **建立目錄結構**:

    ```bash
    mkdir -p docs/adr
    ```

2. **建立 ADR-0001 (Record Architecture Decisions)**:
    * 記錄「我們決定使用 ADR 來記錄架構決策」。
3. **補錄關鍵決策**:
    * **ADR-0002**: 使用 Monorepo 架構 (Turborepo/PNPM)。
    * **ADR-0003**: 使用 Firebase 作為 Backend-as-a-Service。
    * **ADR-0004**: 採用 TailwindCSS 進行樣式開發。
4. **整合流程**:
    * 在 Pull Request Template 中加入「是否涉及架構變更？若是，請附上 ADR」。

---

## 3. 設計系統文件化 (Design System / Storybook) `[P2]`

### 目標

建立色彩、排版與元件庫的標準使用文件，確保 UI/UX 一致性，並作為設計師與工程師的溝通橋樑 (Core Rules 4.1)。

### 技術選型

* **工具**: Storybook 8 (Vue 3 + Vite 支援)。
* **部署**: Chromatic 或 GitHub Pages。

### 實作步驟

1. **初始化 Storybook**:

    ```bash
    pnpm dlx storybook@latest init
    ```

    * 選擇 Vue 3 + Vite。
2. **配置 Tailwind**:
    * 確保 `.storybook/preview.ts` 引入 `index.css` 以載入 Tailwind 樣式。
3. **撰寫 Stories**:
    * 為基礎元件 (Button, Input, Badge) 撰寫 `*.stories.ts`。
    * 建立 `Colors.mdx` 展示色票 (Primary, Secondary, Error)。
    * 建立 `Typography.mdx` 展示字體層級 (H1~H6, Body)。
4. **自動化部署**:
    * 設定 GitHub Actions 在 Push main 時部署至 `subs-buddy-storybook.web.app`。

---

## 4. 架構分層強制檢測 (Strict Layer Enforcement) `[P2]`

### 目標

防止架構腐化 (Architecture Erosion)，例如 View 層直接呼叫 DB SDK，或 Core 層依賴 UI 層。於 CI 階段強制檢查依賴關係。

### 技術選型

* **工具**: `dependency-cruiser`。
* **規則**: 禁止循環依賴、禁止跨層違規引用。

### 實作步驟

1. **安裝工具**:

    ```bash
    pnpm add -D dependency-cruiser
    ```

2. **初始化設定**:

    ```bash
    npx depcruise --init
    ```

3. **定義規則 (.dependency-cruiser.js)**:
    * `forbidden`:
        * **No Cycle**: 禁止任何循環依賴。
        * **No View to DB**: `src/views` 不能 import `firebase/*` (必須透過 `services`).
        * **No Core to UI**: `packages/core` 不能 import `apps/web` 相關內容。
4. **CI 整合**:
    * `package.json`: `"depcruise": "depcruise src --config .dependency-cruiser.js"`
    * CI Pipeline 加入此檢查步驟。

---

## 5. 複雜度監控 (Cognitive Complexity Monitoring) `[P3]`

### 目標

強制單一函式的認知複雜度 (Cognitive Complexity) < 15，降低代碼閱讀負擔，減少邏輯錯誤 (Core Rules 1.1)。

### 技術選型

* **工具**: SonarCloud (Current) 或 ESLint Plugin (`eslint-plugin-sonarjs`).

### 實作步驟

1. **ESLint 設定 (本地防護)**:
    * 安裝 `eslint-plugin-sonarjs`。
    * 設定規則:

        ```json
        "sonarjs/cognitive-complexity": ["error", 15]
        ```

    * 這能讓開發者在 IDE 中即時看到紅字警告。
2. **SonarCloud 設定 (CI 防護)**:
    * 在 SonarCloud Dashboard 中設定 Quality Gate。
    * Condition: `Cognitive Complexity > 15` count must be 0 on New Code.
3. **重構現有代碼**:
    * 執行 Lint 掃描，找出超標函式。
    * 使用 Extract Method、Early Return 等技巧降低複雜度。

---

## 優先級建議 (Roadmap Alignment)

* **立即執行 (Immediate)**:
  * **ADR**: 成本極低，建立目錄即可開始記錄，對團隊溝通幫助大。
  * **Constraint Checking (Dep Cruiser)**: 安裝設定快，能有效防止新寫的爛 code。
* **短期規劃 (Short-term)**:
  * **Storybook**: 隨著 UI 元件增加，文件化需求會變高。
  * **Complexity**: 整合入 ESLint 即可。
* **長期演進 (Long-term)**:
  * **Monorepo Refactoring (UI Kit)**: 屬於較大的重構工程，建議在準備開發 Admin 後台前執行。
