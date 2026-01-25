# 進階功能實作計畫 (Advanced Features Implementation Plan)

本文件詳細說明以下四項進階功能的架構設計與實作步驟：

1. **API 文件自動化 (Automated API Documentation)**
2. **Web Push 通知服務 (Web Push Notifications)**
3. **大數據倉儲整合 (BigQuery Data Warehouse)**
4. **事件驅動架構 (Event-Driven Architecture)**

---

## 1. API 文件自動化 (Automated API Documentation) `[P2]`

### 目標

確保 API 文件與程式碼同步，解決手動維護 Swagger/OpenAPI 的痛點 (Core Rules 9.1)。

### 技術選型

* **工具**: `tsoa` (TypeScript OpenAPI)
* **UI**: `swagger-ui-express`
* **整合**: 整合至 `apps/functions` 的 Express App 中。

### 架構設計

* **Code-First Approach**: 直接在 Controller 程式碼中使用 Decorators (`@Route`, `@Get`) 定義路由與參數。
* **自動生成**: 編譯階段由 `tsoa` 掃描程式碼，生成 `swagger.json`。
* **託管**: Cloud Functions 提供一個 `/api-docs` 端點渲染 Swagger UI。

### 實作步驟

1. **安裝依賴**:

    ```bash
    pnpm add tsoa swagger-ui-express --filter functions
    pnpm add -D @types/swagger-ui-express --filter functions
    ```

2. **配置 `tsoa.json`**:
    * 設定 `entryFile` 為 `src/index.ts`。
    * 設定 `outputDirectory` 為 `src/generated`。
3. **重構 Controller**:
    * 將現有的 Express Route Handler 重構為 Class Controller。
    * 範例：

        ```typescript
        @Route("groups")
        export class GroupController extends Controller {
            @Get("{groupId}")
            public async getGroup(groupId: string): Promise<Group> { ... }
        }
        ```

4. **整合 Express**:
    * 註冊 `RegisterRoutes(app)` (由 tsoa 生成)。
    * 掛載 Swagger UI: `app.use("/docs", swaggerUi.serve, ...)`。

---

## 2. Web Push 通知服務 (Web Push Notifications) `[P3]`

### 目標

提升使用者留存率，即使應用程式在背景也能接收通知 (Mobile Rules)。

### 技術選型

* **Provider**: Firebase Cloud Messaging (FCM)
* **Frontend**: Service Worker (`firebase-messaging-sw.js`)
* **Backend**: `firebase-admin` Messaging API

### 流程設計

1. **取得權限 (Frontend)**:
    * 使用者登入後，詢問通知權限 (`Notification.requestPermission()`)。
    * 取得 FCM Token。
    * 將 Token 上傳至 Firestore: `users/{uid}/fcmTokens/{tokenId}`。
2. **發送通知 (Backend)**:
    * 觸發點 (Trigger): 例如「拼團成功」或「新訊息」。
    * Cloud Function 讀取目標使用者的 FCM Tokens。
    * 呼叫 `admin.messaging().sendMulticast()` 發送。
3. **背景處理 (Service Worker)**:
    * `onBackgroundMessage` 處理背景通知顯示。
    * 點擊通知開啟 App 特定頁面 (Deep Link)。

### 實作步驟

1. **Web 設定**:
    * 建立 `public/firebase-messaging-sw.js`。
    * 在 `src/services/notificationService.ts` 實作 Token 獲取與上傳邏輯。
2. **Firestore Schema**:
    * `users/{uid}/fcmTokens` (Subcollection)。
    * 欄位: `token`, `deviceType`, `lastUsedAt`.
3. **Backend 發送器**:
    * 建立 `packages/core/src/services/pushService.ts`。
    * 實作 `sendToUser(uid, payload)`。

---

## 3. 大數據倉儲整合 (BigQuery Data Warehouse) `[P3]`

### 目標

支援複雜的 SQL 商業分析 (OLAP)，彌補 Firestore NoSQL 查詢限制 (Enterprise Rules 8)。

### 技術選型

* **工具**: Firebase Extensions - **Stream Collections to BigQuery** (`firebase/firestore-bigquery-export`)。
* **Infra**: Terraform (`google_firebase_extensions_instance`) 或 Firebase CLI。

### 架構設計

* **即時同步**: Firestore 文件變更 -> Extension -> BigQuery Raw Change Log。
* **視圖層 (Views)**: 在 BigQuery 建立 View 將 Change Log 轉換為最終狀態表 (Latest Snapshot)。

### 目標集合 (Collections)

1. **users**: 分析用戶成長、地區分佈。
2. **groups**: 分析拼團成功率、熱門類別。
3. **logs**: (Audit Logs) 分析系統錯誤率、資安已遮蔽日誌。

### 實作步驟

1. **啟用 API**: Google Cloud BigQuery API。
2. **配置 Extension (Terraform)**:

    ```hcl
    resource "google_firebase_extensions_instance" "bigquery_export_users" {
      provider = google-beta
      instance_id = "firestore-bigquery-export-users"
      extension_ref = "firebase/firestore-bigquery-export@0.1.35"
      params = {
        COLLECTION_PATH = "users"
        DATASET_ID = "firestore_export"
        TABLE_ID = "users"
      }
    }
    ```

3. **建立 Views**: 執行 `fs-bq-schema-views` 腳本生成 SQL View。

---

## 4. 事件驅動架構 (Event-Driven Architecture) `[P2]`

### 目標

解耦系統組件，提升延展性與回應速度 (Enterprise Patterns)。

### 技術選型

* **Message Broker**: Google Cloud Pub/Sub。
* **Implementation**: Cloud Functions (`functions.pubsub`).

### 架構設計

* **Publisher (發布者)**:
  * 當商業邏輯完成 (如 `createGroup`)，不直接呼叫 Email Service，而是發布事件 `GROUP_CREATED` 至 Pub/Sub。
* **Subscriber (訂閱者)**:
  * 獨立的 Cloud Functions 訂閱特定 Topic。
  * Subscriber A: 發送確認信。
  * Subscriber B: 更新搜尋索引 (Algolia/Typesense)。
  * Subscriber C: 記錄 Analytics。

### 實作步驟

1. **定義 Topics**:
    * `user.registered`
    * `group.created`
    * `group.joined`
2. **建立 Publisher 工具**:
    * `apps/functions/src/utils/pubsub.ts`: 封裝 `@google-cloud/pubsub`。
    * `publishEvent(topic, data)`.
3. **實作 Subscribers**:

    ```typescript
    export const onGroupCreated = functions.pubsub.topic('group.created').onPublish((message) => {
        // Handle side effects (Email, Indexing)
    });
    ```

4. **重構現有邏輯**: 將 Side Effects 從主要 HTTP/Trigger 函式中剝離。

---

## 優先級建議 (Implementation Priority)

1. **API Docs**: 優先實作，方便前後端協作。
2. **Event-Driven**: 隨業務邏輯複雜度增加逐步重構。
3. **Web Push**: 視 Mobile 用戶需求排程。
4. **BigQuery**: 視數據分析需求排程 (初期可用 Firestore Dashboard 頂替)。
