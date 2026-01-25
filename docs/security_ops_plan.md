# 資安與維運實作計畫 (Security & Operations Implementation Plan)

本文件詳細說明以下五項進階維運與資安功能的架構設計與實作步驟：

1. **雲端預算監控 (Cloud Budget Monitoring)**
2. **智慧內容審查 (AI Content Moderation)**
3. **優雅停機機制 (Graceful Shutdown)**
4. **跨區域災難復原 (Multi-Region Disaster Recovery)**
5. **開源授權合規掃描 (License Compliance Scanning)**

---

## 1. 雲端預算監控 (Cloud Budget Monitoring) `[P2]`

### 目標

防止因流量暴衝、程式 Bug (如無限迴圈寫入 DB) 或惡意攻擊造成的財務災難 (Enterprise Ops)。

### 技術選型

* **工具**: Google Cloud Billing Budgets API
* **IaC**: Terraform (`google_billing_budget`)
* **通知**: Pub/Sub + Cloud Functions (用於觸發熔斷) 或 Email/Slack。

### 實作步驟

1. **Terraform 設定**:
    * 在 `apps/web/infra/terraform/main.tf` 新增 Budget Resource。
    * 需要 `billing_account_id` 變數。

    ```hcl
    resource "google_billing_budget" "budget" {
      billing_account = var.billing_account_id
      display_name    = "Monthly Budget"
      amount {
        specified_amount {
          currency_code = "TWD"
          units = "3000" # 設定預算上限
        }
      }
      threshold_rules {
        threshold_percent = 0.5
      }
      threshold_rules {
        threshold_percent = 0.9
      }
      threshold_rules {
        threshold_percent = 1.0 # 達標時觸發
      }
      all_updates_rule {
        pubsub_topic = google_pubsub_topic.billing_alerts.id # 觸發 Pub/Sub
      }
    }
    ```

2. **熔斷機制 (Circuit Breaker)**:
    * 實作 Cloud Function 訂閱 `billing_alerts` Topic。
    * 若收到 100% 預算告警，自動呼叫 Cloud API 禁用高成本服務 (如停用特定 Cloud Functions 或限制 Firestore Quota)。

---

## 2. 智慧內容審查 (Smart Content Moderation) `[P2]`

### 目標

自動過濾聊天室中的色情、暴力圖片與毒性文字，降低人工審核成本 (Safety)。

### 技術選型

* **Image API**: Google Cloud Vision API (SafeSearch Detection).
* **Text API**: Google Cloud Natural Language API (Sentiment Analysis) 或 Perspective API.
* **Trigger**: Firestore `onCreate` (Chat Messages) 或 Storage `onFinalize` (Images).

### 流程設計

1. **圖片審查**:
    * 使用者上傳圖片至 Cloud Storage。
    * 觸發 `scanImage` Cloud Function。
    * 呼叫 Vision API 檢測 `SafeSearchAnnotation` (Adult, Violence, Racy)。
    * 若任一指標為 `LIKELY` 或 `VERY_LIKELY`：
        * 刪除圖片或將其標記為 `hidden`。
        * 記錄審計日誌 (`audit_logs`)。
        * 對用戶發出警告。
2. **文字審查**:
    * 聊天訊息寫入 Firestore 前 (透過 Security Rules 難以實作) 或寫入後 (Cloud Function)。
    * 建議：寫入後觸發 `scanText`。若發現違規，更新訊息內容為 `[已遮蔽]` 並禁言用戶。

### 實作步驟

1. **啟用 API**: Cloud Vision & Natural Language API。
2. **實作 Functions**:
    * `apps/functions/src/triggers/moderation.ts`。
    * 使用 `@google-cloud/vision` SDK。

---

## 3. 優雅停機機制 (Graceful Shutdown) `[P1]`

### 目標

確保在自動擴縮容 (Auto-scaling) 或版本更新部署時，正在處理中的請求能完整結束，不被強制中斷 (Cloud Native Rules 7)。

### 技術選型

* **Framework**: Express.js (in Cloud Functions / Cloud Run).
* **Signal**: `SIGTERM`, `SIGINT`.

### 實作步驟

1. **HTTP Server 封裝**:
    * 雖然 Firebase Cloud Functions(v2) 託管於 Cloud Run，平台會處理信號，但在自架容器或特定 Runtime 下需手動處理。
    * 在 `apps/functions/src/index.ts` 或 `server.ts` 中監聽 `process.on('SIGTERM')`。
2. **Connection Draining**:
    * 停止接收新連線 (`server.close()`)。
    * 等待現有連線完成 (設定 Timeout，例如 30秒)。
    * 關閉資料庫連線 (Firestore SDK 通常自管理，但 SQL 連線池需手動關閉)。
3. **實作範例**:

    ```typescript
    const server = app.listen(port);
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
            logger.info('HTTP server closed');
            // Close DB connections
            process.exit(0);
        });
    });
    ```

---

## 4. 跨區域災難復原 (Multi-Region Disaster Recovery) `[P2]`

### 目標

當主要區域 (e.g. `asia-east1`) 發生機房級故障時，能切換至備援區域 (e.g. `asia-northeast1`)，保證服務高可用 (Enterprise Rules 4)。

### 架構設計 (Active-Passive)

* **Database**:
  * Firestore: 升級為 **Multi-region location** (如 `nam5` 美國多區) 或手動實作跨區備份同步。
  * 由於 Firestore Multi-region 成本高，通常採用 **Scheduled Backup + Restore** (RPO 較高) 或 **Dual Write** (複雜度高)。
  * 對於本專案，建議 **定期備份至 Multi-Region Storage Bucket**。
* **Compute (Cloud Functions)**:
  * 在兩個 Region 部署相同的 Functions。
  * 使用 **Global Load Balancer** 指向主 Region，故障時切換後端群組。

### 實作步驟

1. **Terraform 修改**:
    * 部署第二組 Cloud Functions 至 `asia-northeast1`。
2. **備份策略**:
    * Cloud Scheduler 每日匯出 Firestore 至 Multi-Region GCS Bucket。
3. **還原演練 (DR Drill)**:
    * 編寫還原腳本：`gcloud firestore import gs://backup-bucket/...`。

---

## 5. 開源授權合規掃描 (License Compliance Scanning) `[P1]`

### 目標

自動偵測專案依賴套件的 License，避免使用具傳染性 (Copyleft) 的授權 (如 GPL, AGPL)，確保商業合規 (Enterprise Legal)。

### 技術選型

* **工具**: `license-checker-rseidelsohn` (npm package) 或 FOSSA (External Service)。
* **CI 整合**: GitHub Actions / GitLab CI。

### 實作步驟

1. **安裝工具**:

    ```bash
    pnpm add -D -w license-checker-rseidelsohn
    ```

2. **配置腳本**:
    * 在 `package.json` 新增 `scan:licenses`:

    ```bash
    license-checker --production --json --out licenses.json --failOn "GPL;AGPL;LGPL"
    ```

3. **CI Pipeline**:
    * 在 Build 階段執行此指令，若發現黑名單授權則中斷部署。
4. **產出報告**:
    * 自動生成 `THIRD_PARTY_NOTICES.md` 供法律團隊審閱或隨產品發布。

---

## 優先級建議

1. **License Scanning**: 成本最低，效益高 (避免法律風險)，可立即實作。
2. **Graceful Shutdown**: 代碼改動小，提升穩定性。
3. **Smart Moderation**: 隨用戶量增長後再導入，初期可賴人工檢舉。
4. **Budget Monitoring**: 需 Billing Account 權限，建議與維運團隊協作。
5. **Multi-Region DR**: 成本極高，建議在達到百萬用戶級別後考慮。
