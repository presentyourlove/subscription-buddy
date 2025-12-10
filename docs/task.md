# 拼團小幫手 (Subscription Buddy) - 待辦事項 (Firebase Edition)

- [x] **專案初始化與環境設定 (Project Initialization)** <!-- id: 0 -->
  - [x] 建立 Vue 專案結構 (Vite + JavaScript) <!-- id: 1 -->
    - [x] 設定 Firebase 專案 (Console Setup) <!-- id: 2 -->
  - [x] 整合 Firebase SDK (Auth, Firestore) <!-- id: 3 -->
  - [x] 設定基礎樣式與 Design System (TailwindCSS) <!-- id: 4 -->

- [x] **第一階段：拼團公佈欄 (The Board)** <!-- id: 5 -->
  - [x] 設計 Firestore 資料結構 (Groups Collection) <!-- id: 6 -->
  - [x] 實作拼團列表介面 (讀取 Firestore) <!-- id: 7 -->
  - [x] 實作搜尋與篩選功能 <!-- id: 8 -->
  - [x] 實作發起拼團功能 (寫入 Firestore) <!-- id: 9 -->
  - [x] 隱私保護實作 (欄位權限設定) <!-- id: 10 -->

- [x] **第二階段：專案式聊天室 (Secure Chat)** <!-- id: 11 -->
  - [x] 設計 Firestore 資料結構 (Chats Collection) <!-- id: 12 -->
  - [x] 實作即時聊天功能 (Firestore Realtime) <!-- id: 13 -->
  - [x] 實作「雙向確認」結案邏輯 <!-- id: 14 -->
  - [x] 實作聊天室警示 (置頂不可關閉) <!-- id: 15 -->
  - [x] 安全性規則設定 (Firestore Security Rules) <!-- id: 16 -->

- [x] **第三階段：信譽評分系統 (Reputation)** <!-- id: 17 -->
  - [x] 設計 Users Collection (用以儲存評分) <!-- id: 18 -->
  - [x] 實作評分介面與寫入邏輯 (含評語與未評分限制) <!-- id: 19 -->
  - [x] 顯示信譽分數 <!-- id: 20 -->

- [x] **第四階段：法律與合規 (Legal & Compliance)** <!-- id: 21 -->
  - [x] 撰寫服務條款與隱私權政策頁面 <!-- id: 22 -->
  - [x] 註冊/登入流程整合條款同意 <!-- id: 23 -->
  - [x] **第五階段：使用者個人檔案 (User Profile)** <!-- id: 25 -->
  - [x] 建立個人檔案頁面 (ProfileView) <!-- id: 26 -->
  - [x] 實作「我的拼團」列表 (包含主辦與參與) <!-- id: 27 -->
  - [x] 導覽列整合個人檔案連結 <!-- id: 28 -->
  
- [x] **第六階段：資料保留策略 (Data Retention)** <!-- id: 30 -->
  - [x] 聊天室自動刪除邏輯 (expireAt) <!-- id: 31 -->
  - [x] 個人檔案頁面顯示保留聲明 <!-- id: 32 -->

- [x] **部署與發布** <!-- id: 29 -->
  - [x] 部署至 Static Hosting (e.g., GitHub Pages/Firebase Hosting) <!-- id: 24 -->
