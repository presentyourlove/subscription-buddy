# Subscription Buddy (合購夥伴)

![Vue.js](https://img.shields.io/badge/Vue.js-3.0+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-Ready-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Subscription Buddy** 是一個專為尋找串流媒體合購夥伴打造的媒合平台。解決了「找不到人分擔 Netflix / Spotify 家庭方案」的痛點，提供一個安全、透明且即時的媒合環境。

---

## 🌟 專案亮點 (Project Highlights)

* **⚡ 極致效能**: 基於 **Vite + Vue 3** 構建，秒級載入，流暢的 SPA 體驗。
* **�️ 型別安全**: 全面導入 **TypeScript**，提供嚴格的型別檢查與更佳的開發體驗。
* **�💬 即時互動**: 整合 **Firebase Firestore** 實作即時聊天室，無須重新整理頁面。
* **🌍 全面國際化**: 內建完整 **i18n** 支援 (繁體中文/English)，無 Hardcoded 字串。
* **� 安全可靠**: 嚴謹的 **Firebase Authentication** 流程與完整的 Firestore 安全規則。
* **📱 響應式設計**: Mobile-First 設計原則，在手機、平板與桌機上皆完美呈現。

---

## ✨ 功能特色 (Features)

* **身分驗證**: 支援 Email/Password 註冊登入與 Google 快速登入。
* **拼團廣場**:
  * **開團**: 快速發起 Netflix, Disney+, Spotify 等服務的合購團。
  * **搜尋**: 關鍵字即時搜尋感興趣的拼團。
  * **狀態**: 自動判斷「招募中」、「已滿團」或「已結團」。
* **專屬聊天室**: 每個拼團擁有獨立討論空間，保障成員隱私。
* **信譽評價系統**: 交易完成後互評機制，建立社群信任度。
* **帳務管理**: 清晰記錄每個拼團的價格、分攤金額與付款狀態。

---

## 💎 程式碼品質 (Code Quality)

本專案嚴格遵循現代前端開發規範：

* **架構分離**: 嚴格遵守 **View - Store - Service** 分層架構，邏輯清晰。
* **Linting**: 通過 **ESLint** 與 **Prettier** 嚴格檢查，Zero Errors/Warnings。
* **Dry Principle**: 抽離共用元件 (Components) 與工具函式 (Utils)，高重用性。
* **Environment Config**: 敏感資訊透過 `.env` 管理，確保安全性。
* **Clean Code**: 無冗餘代碼，移除所有 `console.log` 與未使用的檔案。

---

## � 快速開始 (Quick Start)

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境設定

複製範例設定檔並填入您的 Firebase Config：

```bash
cp .env.example .env
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

瀏覽器打開 `http://localhost:5173` 即可看見畫面。

---

## 📱 支援平台 (Supported Platforms)

* **Web**: Chrome, Firefox, Safari, Edge (最新版本)
* **Mobile Web**: iOS Safari, Android Chrome (PWA Ready)
* **Docker**: 支援容器化部署

---

## 🛠️ 技術堆疊 (Technology Stack)

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript | Strong Typing & Modern ES Features |
| **Frontend** | Vue 3 | Composition API |
| | Vite | Next Generation Frontend Tooling |
| | TailwindCSS | Utility-first CSS Framework |
| | Pinia | Intuitive State Management |
| | Vue I18n | Internationalization plugin |
| | Vue Toastification | Toast Notification System |
| **Backend / DB** | Firebase | Auth, Firestore, Hosting |
| **PWA** | vite-plugin-pwa | Offline Support & Installable |
| **Testing** | Vitest | Blazing Fast Unit Test Framework |
| | Playwright | Reliable End-to-End Testing |
| **DevOps** | Docker | Containerization |

---

## 專案結構 (Project Structure)

```text
src/
├── components/     # 共用 UI 元件 (Buttons, Inputs, Modals)
├── composables/    # Vue Composables (useFirestoreDoc, useNotification)
├── firebase/       # Firebase 初始化與設定
├── locales/        # 多語系翻譯檔 (zh-TW, en-US)
├── services/       # API 服務層 (封裝 Firestore 操作)
├── stores/         # Pinia 狀態管理 (User, Group, Chat)
├── utils/          # 工具函式 (Formatters, Constants)
└── views/          # 頁面路由組件 (Home, Login, Dashboard)
```

---

## � 開發指南 (Development Guide)

1. **新增頁面**: 在 `src/views` 建立 `.vue` 檔，並於 `src/router/index.js` 註冊路由。
2. **新增狀態**: 在 `src/stores` 建立 Store，處理全域資料流。
3. **資料存取**: 所有資料庫操作請寫在 `src/services`，禁止在 Component 直接呼叫 Firebase SDK。
4. **樣式開發**: 優先使用 Tailwind Utility Classes，特殊需求才寫在 `<style>`.

---

## 🧪 測試 (Testing)

### 單元測試 (Unit Test)

測試核心邏輯與元件渲染：

```bash
npm test
```

### 端對端測試 (E2E Test)

模擬真實使用者操作流程：

```bash
npx playwright test
```

---

## � 打包發布 (Build & Publish)

### 建置生產版本

```bash
npm run build
```

### Docker 部署

```bash
docker build -t subscription-buddy .
docker run -p 8080:80 subscription-buddy
```

---

## 📚 API 文件與測試 (API Documentation)

本專案採用 **Serverless** 架構 (Firebase)，前端直接透過 SDK 與後端通訊。
為確保可維護性，所有後端交互皆封裝於 `src/services/` 目錄下：

* **AuthService**: 處理登入、註冊、登出。
* **GroupService**: 拼團的 CRUD 與搜尋。
* **ChatService**: 聊天室訊息發送與監聽。
* **UserService**: 使用者資料管理。

每個 Service 方法皆包含 JSDoc 註解說明參數與回傳值。

---

## 🔮 未來規劃 (Future Roadmap)

基於專案現況與未來擴展需求，我們擬定以下分階段優化藍圖：

#### 🛠️ 開發體驗與架構 (DevEx & Architecture)

1. **架構模組化 (Monorepo Refactoring)** `[V3]`
    * **描述**: 當商業邏輯複雜化時，將 `core` (Model/Service) 與 `ui` (View) 分離為不同 Package。
    * **效益**: 提升編譯速度，並允許邏輯在不同專案 (如 Admin 後台) 間共用。

#### 🛡️ 安全性與維運 (Security & DevOps)

1. **自動化備份與還原演練 (Automated Backup & DR)** `[V3]`
    * **描述**: 設定 Cloud Scheduler 定期備份 Firestore 至 Cloud Storage，並撰寫還原腳本。
    * **效益**: 符合企業級備援策略 (Backup Strategy)，確保災難發生時的 RTO/RPO 達標。

2. **交易冪等性機制 (Idempotency Keys)** `[Pending]`
    * **描述**: 針對關鍵交易 (如開團、結案) 實作操作冪等性，防止重複扣款或狀態異常。
    * **效益**: 提升分散式系統的強一致性與可靠度。

3. **Security Rules 單元測試** `[Pending]`
    * **描述**: 建立專門針對 `firestore.rules` 的自動化測試套件。
    * **效益**: 確保權限邏輯的正確性，防止因規則修改導致的權限洩漏。

#### 🌍 無障礙與多元化 (Accessibility & Inclusion)

1. **WCAG 2.1 自動化稽核** `[Pending]`
    * **描述**: 引入 `pa11y` 或 `axe-core` 於 CI 流程中。
    * **效益**: 確保應用程式符合無障礙標準，照顧視障或操作不便的使用者。

2. **多主題切換支援 (Theme Switching)** `[Pending]`
    * **描述**: 解除目前的強制深色模式限制，實作淺色/深色主題切換。
    * **效益**: 尊重使用者系統偏好，提升在不同環境光線下的閱讀舒適度。

3. **手勢互動優化 (Mobile Gestures)** `[Pending]`
    * **描述**: 引入 `useSwipe` 等手勢庫，支援左滑返回、下拉更新等原生 App 體驗。
    * **效益**: 符合行動裝置使用習慣，提升 PWA 的操作直覺性。

4. **安全區域適配 (Safe Area Adaptation)** `[Pending]`
    * **描述**: 針對 iPhone 動態島與瀏海屏進行 CSS `env(safe-area-inset)` 適配。
    * **效益**: 防止內容被遮擋，確保在各種全螢幕裝置上的視覺完整性。

#### 📊 數據與分析 (Analytics)

1. **轉換率漏斗追蹤 (Custom Events Strategy)** `[Pending]`
    * **描述**: 定義關鍵路徑 (如：註冊 -> 開團 -> 滿團) 的自訂事件。
    * **效益**: 精確掌握使用者流失節點，作為產品迭代的數據支撐。

#### ⚖️ 合規與私隱 (Compliance & Privacy)

1. **GDPR 資料權利自動化 (Subject Rights Automation)** `[Pending]`
    * **描述**: 實作「一鍵匯出個資」與「徹底刪除帳號」的自助功能。
    * **效益**: 滿足 GDPR/CCPA 對於資料可攜權與被遺忘權的法律要求，降低法遵風險。

2. **端對端加密 (E2E Encryption)** `[Pending]`
    * **描述**: 針對聊天室訊息實作客戶端加密 (如 Signal Protocol)，僅參與者可解密。
    * **效益**: 確保即使伺服器被入侵，使用者的對話內容依然安全，達到最高資安標準。

---

## 👤 作者 (Author)

Presentyourlove

---

## ❤️ 致謝 (Acknowledgment)

* 感謝 **Vue.js** 與 **Vite** 團隊提供優秀的開發體驗。
* 感謝 **Firebase** 提供強大的後端基礎設施。
