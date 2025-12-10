# 拼團小幫手 (Subscription Buddy)

一個協助使用者輕鬆尋找合購串流服務 (Netflix, Spotify, YouTube Premium 等) 夥伴的媒合平台。提供開團、搜尋拼團、即時聊天室與信譽評價系統。

## ✨ 主要功能

* **帳號整合**: 支援 Email 註冊/登入與 Google 快速登入。
* **拼團媒合**:
  * **發起拼團**: 設定服務名稱、價格、名額與說明。
  * **搜尋拼團**: 可透過關鍵字搜尋感興趣的服務。
  * **狀態管理**: 自動管理開團/滿團/結團狀態。
* **即時溝通**:
  * **專屬聊天室**: 每個拼團皆有獨立聊天室，僅限成員進入。
  * **即時訊息**: 整合 Firebase Firestore 實現訊息即時推播。
* **信譽評價**:
  * **雙向確認**: 團主與成員需互相確認交易完成。
  * **互評機制**: 交易結束後可互相評價，累積信譽分數，過濾雷隊友。
* **多語系支援**: 完整繁體中文介面 (i18n)。

## 🛠️ 技術棧 (Tech Stack)

### 前端 (Frontend)

* **Vue 3**: 採用 Composition API 進行開發。
* **Vite**: 極速的前端建置工具。
* **Vue Router**: 處理單頁應用 (SPA) 路由。
* **Pinia**: 狀態管理 (User, Group, Chat Stores)。
* **Vue I18n**: 國際化多語系支援。
* **TailwindCSS**: Utility-first CSS 框架，打造現代化響應式介面。

### 後端與基礎設施 (Backend & Infra)

* **Firebase Authentication**: 處理使用者身份驗證。
* **Firebase Firestore**: NoSQL 雲端資料庫，儲存使用者、拼團與聊天訊息。
* **Firebase Hosting**: (選擇性) 靜態網站託管。

## 📂 專案結構

```
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
├── utils/          # 工具函式 (如 getServiceLogo)
└── views/          # 頁面組件 (Home, Login, CreateGroup, ChatRoom 等)
```

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴

確保您的環境已安裝 Node.js (推薦 v18+)。

```bash
npm install
```

### 2. 環境設定

本專案目前使用直接寫入的 Firebase Config (位於 `src/firebase/config.js`)。
若您要連接到自己的 Firebase 專案，請修改該檔案中的 `firebaseConfig` 物件。

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

## 📝 開發規範

本專案遵循以下重構原則 (基於 Clean Architecture 精神)：

1. **View Layer**: 僅負責 UI 呈現與使用者互動，不直接呼叫 API。
2. **Store Layer (Pinia)**: 管理應用程式狀態，處理 UI 邏輯與錯誤狀態。
3. **Service Layer**: 封裝所有 Firebase/API 操作，保持存取層獨立。

## 📄 授權 (License)

MIT License
