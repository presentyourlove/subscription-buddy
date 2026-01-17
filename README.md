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
* **🛡️ 安全優先**: 實作 **E2E Encryption** (端對端加密) 與 **GDPR** 資料自主權，達到企業級資安標準。
* **📱 完美適配**: 支援 **PWA** (Progressive Web App)，具備 iOS 瀏海適配、手勢操作與離線存取能力。
* **💬 即時互動**: 整合 **Firebase Firestore** 實作即時聊天室，無須重新整理頁面。
* **🌍 全面國際化**: 內建完整 **i18n** 支援 (繁體中文/English)，無 Hardcoded 字串。

---

## ✨ 功能特色 (Features)

* **身分驗證**: 支援 Email/Password 註冊登入與 Google 快速登入 (OAuth)。
* **拼團廣場**:
  * **開團**: 快速發起 Netflix, Disney+, Spotify 等服務的合購團。
  * **搜尋**: 支援模糊搜尋 (Fuzzy Search)，即時找到感興趣的拼團。
  * **狀態**: 自動判斷「招募中」、「已滿團」或「已結團」。
* **隱私通訊**:
  * **E2EE**: 聊天室訊息採用 **RSA + AES** 混合加密，伺服器無法窺探內容。
  * **安全性**: 支援訊息發送、加入/退出通知。
* **信譽評價**: 交易完成後互評機制，建立社群信任度。
* **個資自主**: 支援一鍵匯出個人資料 (JSON) 與徹底刪除帳號 (Right to be Forgotten)。

---

## 💎 程式碼品質 (Code Quality)

本專案嚴格遵循現代前端開發規範：

* **Type Safety**: 全面導入 **TypeScript**，提供嚴格的型別檢查。
* **Architecture**: 嚴格遵守 **View - Store - Service** 分層架構，邏輯清晰。
* **Linting / Formatting**: 整合 **ESLint**, **Prettier** 與 **Husky** (Git Hooks)，確保程式碼一致性。
* **Testing**: 包含 **Vitest** (單元測試) 與 **Playwright** (E2E 測試)。
* **Accessibility**: 符合 **WCAG 2.1** 標準，並通過 `pa11y-ci` 自動化稽核。
* **CI/CD Ready**: 包含 Dockerfile 與健康檢查指令，支援容器化部署。

---

## 🚀 快速開始 (Quick Start)

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
# 或開啟模擬器模式
npm run dev:emulator
```

瀏覽器打開 `http://localhost:5173` 即可看見畫面。

---

## 📱 支援平台 (Supported Platforms)

| Platform | Support Type | Details |
| :--- | :--- | :--- |
| **Web** | Modern Browsers | Chrome, Firefox, Safari, Edge |
| **Android** | PWA / TWA | 支援 add-to-home screen, TWA 打包上架 Play Store |
| **iOS** | PWA / WebClip | 支援 Safari add-to-home, Fullscreen display (manifest) |
| **Desktop** | Web / Electron | 響應式網頁，未來可封裝為 Electron App |

---

## 🛠️ 技術堆疊 (Technology Stack)

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript | Strong Typing & Modern ES Features |
| **Frontend** | Vue 3 | Composition API |
| | Vite | Next Generation Frontend Tooling |
| | TailwindCSS | Utility-first CSS Framework (Dark Mode support) |
| | Pinia | Intuitive State Management |
| | Vue I18n | Internationalization plugin |
| **Backend** | Firebase | Auth, Firestore, Hosting, Analytics |
| **Security** | Web Crypto API | Native Browser Cryptography for E2EE |
| **PWA** | vite-plugin-pwa | Offline Support & Installable |
| **Testing** | Vitest | Blazing Fast Unit Test Framework |
| | Playwright | Reliable End-to-End Testing |
| **DevOps** | Docker | Containerization |

---

## 🏗️ 專案結構 (Project Structure)

```text
src/
├── components/     # 共用 UI 元件 (Buttons, Inputs, Modals)
├── composables/    # Vue Composables (Reusability Logic)
├── firebase/       # Firebase 初始化與設定
├── locales/        # 多語系翻譯檔 (zh-TW, en-US)
├── services/       # API 服務層 (Firestore & Crypto 封裝)
├── stores/         # Pinia 狀態管理 (User, Group, Chat)
├── types/          # TypeScript 型別定義
├── utils/          # 工具函式 (Formatters, Constants, IndexedDB)
└── views/          # 頁面路由組件 (Home, Login, Profile)
```

---

## 📖 開發指南 (Development Guide)

1. **新增頁面**: 在 `src/views` 建立 `.vue` 檔，並於 `src/router/index.js` 註冊路由。
2. **新增狀態**: 在 `src/stores` 建立 Store，處理全域資料流。
3. **資料存取**: 所有資料庫操作請寫在 `src/services`，禁止在 Component 直接呼叫 Firebase SDK。
4. **樣式開發**: 優先使用 Tailwind Utility Classes，特殊需求才寫在 `<style>`.
5. **提交規範**: 遵循 **Conventional Commits** (e.g. `feat: add chat`, `fix: login error`)。

---

## 🧪 測試 (Testing)

### Web 測試

* **單元測試**: `npm test` (Vitest)
* **E2E 測試**: `npx playwright test`

### Mobile 測試 (Android/iOS)

建議使用真實裝置或模擬器進行驗證，特別關注：

1. **PWA 安裝**: 檢查 Manifest 是否正確載入。
2. **安全區域**: 檢查劉海 (Notch) 與 Home Indicator 是否遮擋內容 (Safe Area)。
3. **手勢操作**: 測試 Pull-to-Refresh 與滑動順暢度。

---

## 📦 打包發布 (Build & Publish)

### Web / PWA

建置生產版本 (自動生成 Service Worker):

```bash
npm run build
```

產物位於 `dist/` 資料庫，可直接部署至 Firebase Hosting 或 Nginx。

### Android (APK)

使用 **Bubblewrap** 或 **Trusted Web Activities (TWA)** 將 PWA 打包為 APK:

```bash
# 需安裝 bubblewrap
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest
bubblewrap build
```

### iOS (WebClip/IPA)

iOS 主要透過 Safari "Add to Home Screen" 安裝。若需上架 App Store，需透過 **Cordova** 或 **Capacitor** 封裝 Web App。

---

## 📚 API 文件與測試 (API Documentation)

本專案採用 **Serverless** 架構，核心邏輯封裝於前端 Service Layer：

* **AuthService**: `src/services/authService.ts` - 處理登入、註冊、登出。
* **GroupService**: `src/services/groupService.ts` - 拼團 CRUD 與搜尋。
* **ChatService**: `src/services/ChatService.ts` - 聊天室管理 (支援 E2EE Payload 處理)。
* **CryptoService**: `src/services/CryptoService.ts` - 負責 RSA/AES 加解密運算。
* **PrivacyService**: `src/services/PrivacyService.ts` - GDPR 資料匯出與刪除。

測試策略建議針對上述 Service 撰寫 Integration Tests (連接 Firebase Emulator)。

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

---

## 👤 作者 (Author)

**Presentyourlove**

---

## ❤️ 致謝 (Acknowledgment)

* 感謝 **Vue.js** 與 **Vite** 團隊提供優秀的開發體驗。
* 感謝 **Firebase** 提供強大的後端基礎設施。
* 特別感謝開源社群提供的優秀 UI 元件與工具庫。
