# Subscription Buddy (Nuxt 3 版)

這是 Subscription Buddy 的 Nuxt 3 遷移版本，專為 Firebase Hosting (SSG) 最佳化。

## 功能遷移狀態

本專案已完成從 Vue 3 SPA 到 Nuxt 3 的核心遷移：

- **核心頁面**: 首頁、登入/註冊、建立群組、群組詳情、聊天室、個人檔案。
- **管理後台**: 管理員儀表板、群組管理。
- **功能支援**: Firebase Auth (Google/Email), Firestore, Pinia (狀態管理), i18n (多語言), TailwindCSS (樣式)。

## 安裝依賴

請確保已安裝 `pnpm` (本專案推薦使用)。

```bash
pnpm install
```

> 注意：本專案使用 workspace 結構，依賴 `@subscription-buddy/core` 套件。請確保在根目錄執行安裝以正確連結依賴。

## 開發伺服器

啟動開發伺服器 (<http://localhost:3000>):

```bash
npm run dev
# 或
pnpm dev
```

## 建置與部署 (SSG)

本專案配置為靜態站點生成 (SSG)，適用於 Firebase Hosting 的免費 Spark 方案。

### 生成靜態檔案

```bash
npm run generate
```

構建完成後的檔案位於 `.output/public` 目錄。

### 部署到 Firebase

```bash
npm run deploy
```

此指令會執行 `nuxt generate` 並自動部署至 Firebase Hosting。

## 目錄結構

- `pages/`: 應用程式路由 (基於檔案)。
- `components/`: Vue 組件 (自動引用)。
- `stores/`: Pinia 狀態管理。
- `locales/`: i18n 翻譯檔 (zh-TW, en-US)。
- `plugins/`: Nuxt 插件 (如 Pinia 持久化, Toast 通知)。
- `layouts/`: 頁面佈局 (使用 `app.vue` 作為根佈局)。
