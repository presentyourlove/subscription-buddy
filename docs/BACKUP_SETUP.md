# 自動化備份設定教學 (Automated Backup Setup Guide)

本文件將引導您完成 **Google Cloud Platform (GCP)** 的儲存桶設定，並連結至 Firebase Cloud Functions，以啟用自動化備份功能。

## 步驟 1: 建立 Cloud Storage Bucket (儲存桶)

備份檔案需要一個存放的地方。我們將在 GCP 上建立一個 Storage Bucket。

1. 前往 **[Google Cloud Console - Storage](https://console.cloud.google.com/storage/browser)**。
2. 確認上方專案選擇器已選中您的專案 (`subscription-buddy`)。
3. 點擊上方的 **"CREATE" (建立)** 按鈕。
4. 填寫設定：
    * **Name your bucket**: 輸入一個全域唯一的名稱，例如 `subscription-buddy-backups` (建議加上日期或隨機後綴以免名稱衝突)。
    * **Choose where to store your data**:
        * **Location type**: 選擇 **Region** (區域)。
        * **Location**: 建議選擇 `asia-east1` (台灣) 或 `us-central1` (美國，可能有免費額度)。
    * **Choose a storage class**: 選擇 **Standard**。
    * **Choose how to control access**: 保持預設 (Uniform)。
    * **Protection tools**: 建議勾選 **Soft delete** (防止誤刪)。
5. 點擊 **"CREATE"** 完成建立。

> **記下您的 Bucket 名稱** (例如 `gs://subscription-buddy-backups`)。

## 步驟 2: 設定權限 (確保 Cloud Functions 可寫入)

Cloud Functions 預設使用 `App Engine default service account`。通常它對同一專案下的 Bucket 有讀寫權限，但為了保險起見，我們確認一下：

1. 在 Storage Browser 列表中，點擊您剛建立的 Bucket 名稱。
2. 點擊上方的 **"PERMISSIONS" (權限)** 分頁。
3. 點擊 **"GRANT ACCESS" (授予存取權)**。
4. 在 **"New principals"** 欄位，輸入您的 App Engine Service Account Email。
    * 格式通常是：`YOUR_PROJECT_ID@appspot.gserviceaccount.com`。
    * 您可以在 IAM 頁面找到它。
5. 在 **"Select a role"** 欄位，選擇 **"Storage Object Admin"** (儲存空間物件管理員)。
6. 點擊 **"SAVE"**。

## 步驟 3: 設定 Cloud Functions 環境變數

現在我們要告訴 Cloud Functions 備份檔案要丟到哪裡去。請在您的 **本地終端機 (Terminal)** 執行以下指令：

```bash
# 請將 YOUR_BUCKET_NAME 替換為步驟 1 建立的名稱 (不含 gs:// 前綴)
firebase functions:config:set backup.bucket="subscription-buddy-backups"
```

### 驗證設定

執行以下指令確認設定已生效：

```bash
firebase functions:config:get
```

您應該會看到類似以下的輸出：

```json
{
  "backup": {
    "bucket": "subscription-buddy-backups"
  }
}
```

## 步驟 4: 部署 Cloud Functions

最後，部署包含備份功能的程式碼：

```bash
firebase deploy --only functions
```

完成！您的 Cloud Scheduler 現在會從每天午夜開始，自動將 Firestore 資料備份到指定的儲存桶中。
