# Sub-Buddy (原 Subscription Buddy)

一個協助使用者輕鬆尋找合購串流服務 (Netflix, Spotify, YouTube Premium 等) 夥伴的媒合平台。提供開團、搜尋拼團、即時聊天室與信譽評價系統。

## ✨ 主要功能

- **帳號整合**: 支援 Email 註冊/登入與 Google 快速登入。
- **拼團媒合**:
  - **發起拼團**: 設定服務名稱、價格、名額與說明。
  - **搜尋拼團**: 可透過關鍵字搜尋感興趣的服務。
  - **狀態管理**: 自動管理開團/滿團/結團狀態。
- **即時溝通**:
  - **專屬聊天室**: 每個拼團皆有獨立聊天室，僅限成員進入。
  - **即時訊息**: 整合 Firebase Firestore 實現訊息即時推播。
- **信譽評價**:
  - **雙向確認**: 團主與成員需互相確認交易完成。
  - **互評機制**: 交易結束後可互相評價，累積信譽分數，過濾雷隊友。
- **多語系支援**: 完整繁體中文介面 (i18n)。

## 🛠️ 技術棧 (Tech Stack)

### 前端 (Frontend)

- **Vue 3**: 採用 Composition API 進行開發。
- **Vite**: 極速的前端建置工具。
- **Vue Router**: 處理單頁應用 (SPA) 路由。
- **Pinia**: 狀態管理 (User, Group, Chat Stores)。
- **Vue I18n**: 國際化多語系支援。
- **TailwindCSS**: Utility-first CSS 框架，打造現代化響應式介面。

### 後端與基礎設施 (Backend & Infra)

- **Firebase Authentication**: 處理使用者身份驗證。
- **Firebase Firestore**: NoSQL 雲端資料庫，儲存使用者、拼團與聊天訊息。
- **Firebase Hosting**: (選擇性) 靜態網站託管。

## 📂 專案結構

```text
src/
├── components/     # 共用 UI 元件 (BaseInput, BaseButton, Navbar 等)
├── firebase/       # Firebase 初始化設定
├── locales/        # 語系檔 (zh-TW.json)
├── services/       # 商業邏輯層 (API 呼叫與資料處理)
│   ├── authService.js
│   ├── userService.js
│   ├── groupService.js
│   └── chatService.js
├── stores/         # Pinia 狀態管理 (串接 Service)
├── utils/          # 工具函式 (如 constants.js, serviceUtils.js)
└── views/          # 頁面組件 (Home, Login, CreateGroup, ChatRoom 等)
```

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴

確保您的環境已安裝 Node.js (推薦 v18+)。

```bash
npm install
```

### 2. 環境設定

本專案使用環境變數管理 Firebase Config。
請將 `.env.example` 複製為 `.env`，並填入您的 Firebase 專案設定值。

```bash
cp .env.example .env
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

啟動後，請瀏覽 `http://localhost:5173`。

### 4. 建置生產版本

```bash
npm run build
```

建置後的檔案將位於 `dist/` 目錄。

## � 部署 (Deployment)

本專案預設使用 **Firebase Hosting** 進行部署。

### 1. 安裝 Firebase Tools

若尚未安裝全局 Firebase CLI，請先執行：
`npm install -g firebase-tools`

### 2. 登入 Firebase

`firebase login`

### 3. 建置專案

`npm run build`

### 4. 部署至 Firebase

`firebase deploy`

若只要部署 Hosting，可執行：
`firebase deploy --only hosting`

部署完成後，CLI 會顯示 Hosting URL。
目前線上展示網址：[https://sub-buddy-2025.web.app](https://sub-buddy-2025.web.app)

## 🧪 測試 (Testing)

本專案包含單元測試與 E2E 測試，確保程式碼品質。

### 單元測試 (Unit Tests)

使用 Vitest 測試核心邏輯：

```bash
npm test
```

### E2E 測試 (End-to-End Tests)

使用 Playwright 測試使用者流程：

```bash
npx playwright test
```

## 🐳 Docker 部署

支援容器化部署，包含多階段建置 (Multi-stage Build)。

### 1. 建置 Image

```bash
docker build -t sub-buddy-app .
```

### 2. 執行容器

```bash
docker run -d -p 8080:80 sub-buddy-app
```

瀏覽 `http://localhost:8080` 即可訪問。

本專案遵循以下重構原則 (基於 Clean Architecture 精神)：

1. **View Layer**: 僅負責 UI 呈現與使用者互動，不直接呼叫 API。
2. **Store Layer (Pinia)**: 管理應用程式狀態，處理 UI 邏輯與錯誤狀態。
3. **Service Layer**: 封裝所有 Firebase/API 操作，保持存取層獨立。

## �️ 合規性與品質 (Compliance & Quality)

本專案嚴格遵循 `GEMINI.md` 開發規範，達到以下標準：

- **零容忍 (Zero Tolerance)**:
  - **i18n**: 全面國際化 (Zero Hardcoded Strings)。
  - **Linting**: 通過 ESLint/Prettier 檢查 (Zero Errors, Zero Warnings)。
  - **Constants**: 所有 Magic Numbers/Strings 皆已提取為常數。
- **安全性 (Security)**:
  - 敏感資料與 API Key 透過 `.env` 管理。
  - *注意*: 針對私有存儲庫 (Private Repo)，已將 `.env` 加入版控白名單 (User Authorization)。
- **程式碼衛生 (Code Hygiene)**:
  - 無殘留的 `console.log` 或 `TODO` 註解。
  - 移除所有未使用的檔案與目錄。

## �📄 授權 (License)

MIT License
