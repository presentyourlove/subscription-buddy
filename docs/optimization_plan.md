# 架構優化與品質提升實作計畫 (Architecture & Quality Plan)

本計畫針對 `README.md` 中提及的五項關鍵優化進行詳細規劃，旨在提升 `subscription-buddy` 的可維護性、擴展性與程式碼品質。

---

## 1. 架構模組化 (Monorepo Refactoring) `[V3]`

### 🎯 目標

將目前的單體 SPA 架構重構為 **Monorepo**，拆分核心商業邏輯 (`core`) 與 UI 層 (`app`)，以支援未來擴展 (如新增 Admin 後台或 Mobile App 共用邏輯)。

### 🛠️ 技術選型

- **Workspace Manager**: `pnpm workspaces` (高效依賴管理)
- **Build System**: `Turborepo` (快取構建產物，加速 CI)

### 📅 實作步驟

1. **初始化 Monorepo**:
    - 在根目錄建立 `pnpm-workspace.yaml`。
    - 移動現有專案至 `apps/web`。

2. **拆分 `packages/core`**:
    - 建立 `packages/core` 目錄。
    - 遷移 `src/services` (API, Firebase), `src/types`, `src/utils` 至此包。
    - 設定 `package.json` 導出 (Exports)。

3. **拆分 `packages/ui` (可選)**:
    - 建立 `packages/ui` 目錄。
    - 遷移通用 UI 元件 (`src/components/common`) 與 Tailwind 設定。
    - 整合 Storybook 於此層。

4. **調整依賴**:
    - `apps/web` 依賴 `@subscription-buddy/core` 與 `@subscription-buddy/ui`。
    - 更新 `vite.config.ts` 與 `tsconfig.json` 的路徑對應 (Path Mapping)。

---

## 2. 架構決策記錄 (Architecture Decision Records - ADR) `[P2]`

### 🎯 目標

建立標準化的決策記錄流程，確保架構演進的可追溯性。

### 📅 實作步驟

1. **建立目錄結構**:
    - 建立 `docs/adr` 目錄。
    - 建立 `docs/adr/template.md` (參考 Michael Nygard 格式)。

2. **初始化首份 ADR**:
    - 撰寫 `0001-record-architecture-decisions.md` (決定開始使用 ADR)。
    - 撰寫 `0002-use-vue3-vite-firebase.md` (記錄目前的技術選型背景)。

3. **工具輔助 (可選)**:
    - 安裝 `adr-tools` (若開發環境支援) 或僅使用 Markdown 模板。

---

## 3. 設計系統文件化 (Design System Documentation) `[P2]`

### 🎯 目標

利用 Storybook 建立「單一真值來源 (Single Source of Truth)」的 UI 文件，包含色彩、排版與元件使用規範。

### 📅 實作步驟

1. **完善 Storybook 設定**:
    - 確保 `.storybook/main.ts` 包含 `@storybook/addon-docs`。
    - 設定 `autodocs: 'tag'` 自動生成文件。

2. **撰寫基礎樣式文件 (.mdx)**:
    - `src/stories/Colors.mdx`: 展示 Tailwind 色票 (Primary, Secondary, Alerts)。
    - `src/stories/Typography.mdx`: 展示字體層級 (H1-H6, Body)。

3. **元件文件化**:
    - 為核心元件 (Button, Input, Card) 撰寫 Story。
    - 使用 JSDoc 註解 Props，讓 Storybook 自動提取說明 (ArgTypes)。

---

## 4. 架構分層強制檢測 (Strict Layer Enforcement) `[P2]`

### 🎯 目標

防止架構腐化 (如 View 層直接依賴 Firebase SDK)，強制執行 **Vue Component -> Store -> Service** 的單向依賴流。

### 🛠️ 技術選型

- **Tool**: `dependency-cruiser`

### 📅 實作步驟

1. **安裝工具**:

    ```bash
    npm install --save-dev dependency-cruiser
    ```

2. **初始化設定**:
    - 執行 `npx depcruise --init`。
    - 建立 `.dependency-cruiser.js`。

3. **定義規則 (Rules)**:
    - **No-View-To-Service**: 禁止 `src/views` 或 `src/components` 直接 import `src/services` (應透過 Store)。
    - **No-Circular**: 禁止循環依賴。
    - **No-Orphan**: 檢測未使用的檔案。

4. **CI 整合**:
    - 在 `package.json` 新增 script: `"depcruise": "depcruise src --config .dependency-cruiser.js"`。
    - 加入 GitHub Actions / Husky Pre-commit。

---

## 5. 複雜度監控 (Cognitive Complexity Monitoring) `[P3]`

### 🎯 目標

量化程式碼複雜度，強制重構過於複雜的函式，提升可讀性。

### 📅 實作步驟

1. **SonarCloud 設定**:
    - 更新 `sonar-project.properties`:

        ```properties
        # 強制檢測複雜度
        sonar.javascript.cognitiveComplexity=15
        sonar.typescript.cognitiveComplexity=15
        ```

2. **本地檢測 (ESLint 輔助)**:
    - 雖然 SonarCloud 是後端檢測，但可先在 ESLint 加入規則以便即時回饋：

        ```bash
        npm install --save-dev eslint-plugin-sonarjs
        ```

    - 更新 `.eslintrc.cjs`:

        ```js
        extends: ["plugin:sonarjs/recommended"],
        rules: {
          "sonarjs/cognitive-complexity": ["error", 15]
        }
        ```

3. **重構熱點**:
    - 執行 Lint 找出超過閥值的函式並進行拆解 (Extract Method)。
