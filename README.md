# Subscription Buddy (合購夥伴)

![Vue.js](https://img.shields.io/badge/Vue.js-3.0+-green.svg)
![Vite](https://img.shields.io/badge/Vite-Ready-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Subscription Buddy** 是一個專為尋找串流媒體合購夥伴打造的媒合平台。解決了「找不到人分擔 Netflix / Spotify 家庭方案」的痛點，提供一個安全、透明且即時的媒合環境。

---

## 🌟 專案亮點 (Project Highlights)

* **⚡ 極致效能**: 基於 **Vite + Vue 3** 構建，秒級載入，流暢的 SPA 體驗。
* **💬 即時互動**: 整合 **Firebase Firestore** 實作即時聊天室，無須重新整理頁面。
* **🌍 全面國際化**: 內建完整 **i18n** 支援 (繁體中文/English)，無 Hardcoded 字串。
* **🛡️ 安全可靠**: 嚴謹的 **Firebase Authentication** 流程與完整的 Firestore 安全規則。
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
| **Frontend** | Vue 3 | Composition API |
| | Vite | Next Generation Frontend Tooling |
| | TailwindCSS | Utility-first CSS Framework |
| | Pinia | Intuitive State Management |
| | Vue I18n | Internationalization plugin |
| **Backend / DB** | Firebase | Auth, Firestore, Hosting |
| **Testing** | Vitest | Blazing Fast Unit Test Framework |
| | Playwright | Reliable End-to-End Testing |
| **DevOps** | Docker | Containerization |

---

## � 專案結構 (Project Structure)

```text
src/
├── components/     # 共用 UI 元件 (Buttons, Inputs, Modals)
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

## 🔮 後繼優化建議 (Future Roadmap)

為了進一步提升平台價值與使用者體驗，建議未來可朝以下方向進行優化：

### 1. 支付與金流整合 (Payment Integration)

* **現況**: 目前僅為資訊媒合，金流需私下轉帳。
* **建議**: 整合 **Stripe** 或 **PayPal**，允許團主設定收款連結，系統自動對帳，保障雙方權益。

### 2. 進階通知系統 (Advanced Notifications)

* **現況**: 僅有 App 內紅點通知。
* **建議**: 引入 **FCM (Firebase Cloud Messaging)** 實作網頁推播通知，或整合 **Line Notify / Telegram Bot**，不錯過任何拼團訊息。

### 3. PWA 離線體驗優化 (PWA Offline Support)

* **現況**: 已有基礎 PWA 配置。
* **建議**: 優化 Service Worker 策略，支援離線瀏覽已載入的拼團資訊與歷史訊息。

### 4. 智能化推薦 (Smart Recommendation)

* **現況**: 依時間排序。
* **建議**: 基於使用者的瀏覽紀錄與興趣標籤，自動推薦可能感興趣的合購服務。

### 5. 管理員後台 (Admin Dashboard)

* **現況**: 仰賴 Firebase Console 管理。
* **建議**: 開發專屬管理後台，處理使用者檢舉、違規拼團下架與全站公告發布。

---

## 👤 作者 (Author)

**Presentyourlove**

---

## ❤️ 致謝 (Acknowledgment)

* 感謝 **Vue.js** 與 **Vite** 團隊提供優秀的開發體驗。
* 感謝 **Firebase** 提供強大的後端基礎設施。
