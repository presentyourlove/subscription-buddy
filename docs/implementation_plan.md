# [拼團小幫手 - 實作計畫 (Phase 4: Legal & Compliance)]

## 目標

完成應用程式的法律合規與部署準備，包括隱私權政策、服務條款以及最終的靜態託管部署。

## 使用者審查 (User Review Required)
>
> [!IMPORTANT]
> **法律免責聲明**：
>
> - 本專案提供的條款模板僅供參考，不構成法律建議。正式上線前建議諮詢法務專業人員。
> - **GDPR/CCPA**：若有歐盟或加州用戶，需特別注意 Cookie Consent (目前版本採最簡化實作)。

## 擬定變更 (Proposed Changes)

### 1. 頁面新增 (Views)

#### [NEW] `src/views/PrivacyPolicy.vue`

- 隱私權政策頁面 (說明資料收集用途)。

#### [NEW] `src/views/TermsOfService.vue`

- 使用者條款頁面 (免責聲明、使用規範)。

### 2. 組件更新 (Components)

#### [NEW] `src/components/Footer.vue`

- 新增全站頁尾，包含版權宣告與上述法律頁面連結。

#### [MODIFY] `src/App.vue`

- 引入 `Footer` 組件，確保每頁底部顯示。

#### [MODIFY] `src/views/LoginView.vue`

- 在登入按鈕下方加入「繼續即代表同意服務條款」的提示字樣。

### 3. 部署準備 (Deployment)

#### [MODIFY] `vite.config.js`

- 確認 `base` 路徑設定正確 (針對 GitHub Pages)。

#### [NEW] `deploy.sh` (Optional)

- 自動化部署腳本。

### 4. 資料保留策略 (Data Retention)

#### [MODIFY] `src/views/ProfileView.vue`

- 在歷史紀錄列表上方加入「聊天室內容保存一年」的提示文字。

#### [MODIFY] `src/stores/chatStore.js`

- 在 `confirmDeal` 動作中加入邏輯：若所有參與者皆已確認，則在 Chat 文件中寫入 `expireAt` (一年後)。

## 驗證計畫 (Verification Plan)

1. **連結檢查**：
   - 點擊頁尾連結，確認能正確跳轉至條款頁面。
   - 確認條款頁面內容顯示正常，且有「返回首頁」按鈕。

2. **RWD 測試**：
   - 確認頁尾在手機版不會跑版。

3. **Build 測試**：
   - 執行 `npm run build`，確認產出 `dist` 資料夾無誤。
