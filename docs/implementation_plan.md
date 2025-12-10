# [拼團小幫手 - 實作計畫 (Firebase Serverless 版)]

## 目標

建立「拼團小幫手」專案，採用 **Firebase Serverless** 架構，以支援整合至全靜態網站 (如 GitHub Pages)。

## 使用者審查 (User Review Required)
>
> [!IMPORTANT]
> **Firebase 架構確認**：
>
> - **前端**：Vue 3 + Vite + JavaScript + TailwindCSS (依據使用者需求使用 JavaScript)。
> - **資料庫**：Cloud Firestore (NoSQL 文件資料庫)。
> - **認證**：Firebase Authentication (此專案初步建議使用「匿名登入」或「Google 登入」以簡化流程)。
> - **部署目標**：建置為靜態檔案，放入您現有的 Landing Page 子目錄中。

## 擬定變更 (Proposed Changes)

### 1. 專案結構初始化

不需前後端分離資料夾，直接建立單一前端專案：

- `src/`: Vue 原始碼
- `firebase/`: Firebase 設定與初始化檔案

### 2. Firebase 設定 (需請您協助)
>
> [!NOTE]
> 我將提供程式碼，但需要您在 Firebase Console 建立專案並提供 `firebaseConfig` (API Key 等資訊)。

### 3. 資料庫設計 (Firestore Schema)

#### `groups` (拼團)

- `id`: Auto-ID
- `title`: 服務名稱 (String)
- `price`: 價格 (Number)
- `slots`: 缺額 (Number)
- `description`: 說明 (String)
- `hostId`: 團長 ID (String, 關聯至 Users)
- `status`: 狀態 (OPEN, FULL, CLOSED)
- `createdAt`: Timestamp

#### `users` (使用者) (對應第三階段)

- `id`: Auth UID
- `nickname`: 暱稱
- `reputation`: 信譽分數 (以子集合或欄位紀錄)

### 4. 前端實作 (Frontend)

#### [NEW] `src/firebase/config.js`

- 初始化 Firebase App，匯出 `db` (Firestore) 與 `auth` (Authentication)。

#### [NEW] `src/stores/`

- `groupStore.js`: 封裝 Firestore 的 CRUD 操作 (getGroups, addGroup)。

#### [NEW] `vite.config.js`

- 設定 `base: './'` 以支援子目錄部署。

#### [NEW] `src/views/HomeView.vue`

- 使用 Firebase SDK (`onSnapshot` 或 `getDocs`) 讀取拼團列表。

## 驗證計畫 (Verification Plan)

1. **本地測試**：
   - 填入模擬的 Firebase Config 進行連線測試 (或使用 Firebase Emulator，若要簡單點則直接連線雲端開發專案)。
   - 確認 `npm run dev` 無錯誤。
2. **功能驗證**：
   - [ ] 測試寫入資料：發起一個拼團，檢查 Firestore Console 確實有資料。
   - [ ] 測試讀取資料：首頁能即時顯示剛剛寫入的拼團。
   - [ ] 測試路由：在子路徑下 (模擬 Landing Page 環境) 路由是否正常。
