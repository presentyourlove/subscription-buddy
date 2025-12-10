# Firebase 專案設定教學 (Setup Guide)

請依照以下步驟在 Firebase Console 完成設定，並取得必要的設定檔。

## 第一步：建立專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)。
2. 點擊 **"新增專案" (Create a project)**。
3. 輸入專案名稱 (e.g., `subscription-buddy`)。
4. Google Analytics 步驟可選擇 "不啟用" (除非您需要分析流量)，然後點擊 "建立專案"。

## 第二步：建立 Web 應用程式 (取得 Config)

1. 進入專案首頁，點擊中央的 **`</>` (Web)** 圖示。
2. **註冊應用程式**：
   - App 暱稱：填寫 `Subscription Buddy Web`。
   - "Also set up Firebase Hosting" 先 **不要勾選** (我們稍後再設)。
   - 點擊 "註冊應用程式"。
3. **新增 Firebase SDK**：
   - 您會看到一段程式碼 `const firebaseConfig = { ... };`。
   - **請複製這段 `firebaseConfig` 的內容** (包含 apiKey, projectId 等)。
   - 這就是我需要的資料！

## 第三步：設定資料庫 (Firestore)

1. 在左側選單點擊 **"建構" (Build)** -> **"Firestore Database"**。
2. 點擊 **"建立資料庫" (Create database)**。
3. **位置 (Location)**：選擇離台灣較近的節點 (e.g., `asia-east1` (Taiwan) 或 `asia-northeast1` (Tokyo))。
4. **安全規則 (Security Rules)**：
   - 選擇 **"以測試模式開始" (Start in test mode)**。
   - *注意：這允許30天內任何人讀寫，方便我們開發。上線前我們會更新為安全規則。*
   - 點擊 "啟用" (Enable)。

## 第四步：設定登入方式 (Authentication)

1. 在左側選單點擊 **"建構" (Build)** -> **"Authentication"**。
2. 點擊 **"開始使用" (Get started)**。
3. 在 "Sign-in method" 分頁中，選擇 **"Google"**：
   - 開啟 "啟用" 開關。
   - 確認 "專案支援電子郵件" (Project support email) 已選取您的信箱。
   - 點擊 "儲存"。
4. (選用) 若尚未完成前端登入按鈕，可先不開啟其他功能。

---

### 🎉 完成後

請回到聊天視窗，將 **第二步** 取得的 `firebaseConfig` 貼給我，例如：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "subscription-buddy.firebaseapp.com",
  projectId: "subscription-buddy",
  storageBucket: "subscription-buddy.firebasestorage.app",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
```
