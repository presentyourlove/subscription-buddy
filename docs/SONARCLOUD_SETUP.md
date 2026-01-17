# SonarCloud Setup Guide (繁體中文)

本文件將引導您完成 SonarCloud 的專案建立與 GitHub Actions 整合設定。

## 步驟 1: 登入 SonarCloud

1. 前往 **[SonarCloud.io](https://sonarcloud.io/)**。
2. 點擊 **"Log in"** 並選擇 **"GitHub"**。
3. 授權 SonarCloud 存取您的 GitHub 帳號 (若首次登入)。

## 步驟 2: 匯入 GitHub 專案

1. 登入後，點擊右上角的 **"+"** 號，選擇 **"Analyze new project"**。
2. 選擇您的 GitHub Organization (若未列出，點擊 "Import an organization from GitHub" 進行安裝)。
3. 在 Repository 列表中，找到 **`subscription-buddy`** 並勾選它。
4. 點擊 **"Set Up"** 按鈕。

## 步驟 3: 設定分析方式

1. 在 "Choose your analysis method" 頁面，選擇 **"With GitHub Actions"**。
2. 您會看到 SonarCloud 提供的設定指引，請專注於下方 **"Create a Secret"** 區塊。

## 步驟 4: 取得 SONAR_TOKEN

1. 在設定頁面中，SonarCloud 會產生一組 **`SONAR_TOKEN`**。
2. **複製** 這組 Token (例如：`sqp_xxxxxxxxxxxxxxxxxxxxxxxxxx`)。

## 步驟 5: 設定 GitHub Secrets

1. 回到您的 GitHub Repository 頁面 (`subscription-buddy`)。
2. 點擊上方選單的 **"Settings"** (設定)。
3. 在左側欄選單中，展開 **"Secrets and variables"**，點擊 **"Actions"**。
4. 點擊右側綠色的 **"New repository secret"** 按鈕。
5. 填寫資訊：
   - **Name**: `SONAR_TOKEN` (必須完全一致)
   - **Secret**: (貼上步驟 4 複製的 Token)
6. 點擊 **"Add secret"**。

## 步驟 6: 確認專案編號 (Project Key)

1. 回到 SonarCloud 設定頁面，確認下方的 `sonar.projectKey` 與 `sonar.organization`。
2. 比較專案根目錄下的 `sonar-project.properties` 檔案內容：

   ```properties
   sonar.projectKey=sub-buddy-2025        <-- 若 SonarCloud 上顯示不同，請修改此行
   sonar.organization=subscription-buddy-org  <-- 若不同，請修改此行
   ```

   > **注意**: 預設我為您設定的是 `sub-buddy-2025`。若您在 SonarCloud 建立專案時使用了不同的名稱，請務必更新此檔案並 Push 上去，否則掃描會失敗。

## 步驟 7: 驗證

1. 完成上述步驟後，下一次 Push code 到 `main` 或 `branch-v2` 分支時，GitHub Actions 就會自動觸發 SonarCloud Scan。
2. 您可以在 GitHub 的 "Actions" 分頁查看執行進度。
3. 執行成功後，SonarCloud 儀表板將顯示程式碼品質報告。
