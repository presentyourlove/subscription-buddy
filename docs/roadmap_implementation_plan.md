# 路線圖功能實作計畫 (Roadmap Implementation Plan)

本計畫針對 `README.md` 中提及的三項關鍵路線圖功能進行詳細規劃與實作指導。

---

## 2. 資料生命週期管理 (Data Lifecycle Policy) `[P2]`

### 📖 說明 (Description)

實作 Firestore 的 **Time-to-Live (TTL)** 策略，自動刪除過期的暫存資料（如日誌、暫存 Token、已結案且無須封存的拼團），以符合 GDPR「資料最小化」原則並控制儲存成本。

- **核心規則**: Core Rules 3.3, Enterprise Rules.
- **適用範圍**: Firestore Collections (`logs`, `notifications`, `invitations`).

### 🛠️ 技術方案

- **Firestore TTL Policies**: Google Cloud 原生功能，無需編寫 Cloud Functions 定時任務。
- **Terraform**: 使用 IaC 管理 TTL 設定 (推薦) 或透過 Console 設定。

### 📅 實作步驟

#### Phase 1: 資料結構準備

1. **定義過期欄位**: 確保目標 Collection 的 Document 包含 `Date` 或 `Timestamp` 類型的欄位（例如 `expiresAt` 或 `createdAt`）。
    - `logs`: 使用 `createdAt`，設定保留 30 天。
    - `notifications`: 使用 `createdAt`，設定保留 90 天。
    - `temp_tokens`: 使用 `expiresAt`，設定過期即刪。

#### Phase 2: 配置 TTL (Terraform)

在 `apps/web/infra/terraform/main.tf` 中新增 `google_firestore_field` 資源：

```hcl
resource "google_firestore_field" "logs_ttl" {
  project    = var.project_id
  database   = "(default)"
  collection = "logs"
  field      = "createdAt"
  
  ttl_config {
    state = "ACTIVE"
  }
  
  # 保留索引配置 (若有查詢需求)
  index_config {
    indexes {
      order = "ASCENDING"
    }
  }
}
```

#### Phase 3: 驗證

1. **Console 檢查**: 確認 Firestore Console 的 "TTL" 分頁顯示狀態為 "Active"。
2. **整合測試**: 建立一個過去時間 (`now - 31 days`) 的 Log，等待 24-72 小時（Firestore TTL 背景執行的延遲）確認被刪除。

---

## 3. 契約測試 (Consumer-Driven Contract Testing) `[P2]`

### 📖 說明 (Description)

引入契約測試 (Contract Testing) 確保前端應用 (`Consumer`) 與後端 Cloud Functions (`Provider`) 之間的 API 協議一致。當後端變更 API 回傳格式時，能即時阻擋不相容的變更，防止線上故障。

- **核心規則**: API Rules 5.
- **工具**: **Pact** (最主流的契約測試框架).

### 🛠️ 技術方案

- **Consumer (Web)**: `@pact-foundation/pact` (產生 Contract JSON).
- **Provider (Functions)**: `@pact-foundation/pact` (驗證 Contract JSON).
- **Broker (Optional)**: Pactflow 或自行架設 Pact Broker (初期可使用本地檔案交換).

### 📅 實作步驟

#### Phase 1: Consumer 端測試 (Web)

1. **安裝依賴**:

   ```bash
   pnpm add -D @pact-foundation/pact
   ```

2. **撰寫測試 (`tests/contract/api.spec.ts`)**:
   攔截 API 請求並定義 "預期" 的互動 (Interaction)。

   ```typescript
   provider.addInteraction({
     state: 'has feature flags',
     uponReceiving: 'a request for feature flags',
     withRequest: { method: 'GET', path: '/api/features' },
     willRespondWith: { status: 200, body: Like({ featureX: true }) }
   })
   ```

3. **生成契約**: 執行測試後，Pact 會在 `pacts/` 目錄生成 JSON 檔案 (e.g., `web-api-provider.json`)。

#### Phase 2: Provider 端驗證 (Functions)

1. **建立驗證測試**:
   在後端專案中載入前端生成的 Pact JSON，並啟動本地 Server 進行回放驗證。

   ```typescript
   new Verifier({
     providerBaseUrl: 'http://localhost:5001',
     pactUrls: [ path.resolve(__dirname, '../../pacts/web-api-provider.json') ]
   }).verifyProvider()
   ```

#### Phase 3: CI 整合

1. **CI Pipeline**:
   - Step 1: 跑前端測試 -> 產出 Pact Files.
   - Step 2: 跑後端測試 -> 讀取 Pact Files 驗證 API 實作.

---

## 4. 功能開關 (Feature Flags) `[P2]`

### 📖 說明 (Description)

利用 **Firebase Remote Config** 實作功能開關。允許在不重新發布 App Store/Web 的情況下，動態開啟/關閉功能、調整參數或進行 A/B Testing。

- **核心規則**: Enterprise Patterns.
- **範圍**: 新功能發布、促銷活動配置、維護模式開關。

### 🛠️ 技術方案

- **Backend**: Firebase Remote Config (Console 控制台).
- **Frontend**: Firebase SDK (`fetchAndActivate`, `getValue`).

### 📅 實作步驟

#### Phase 1: 定義參數 (Console)

1. 在 Firebase Console > Remote Config 建立參數：
   - `enable_new_chat_ui` (Boolean): `false`
   - `promo_banner_text` (String): `"Welcome!"`
   - `maintenance_mode` (Boolean): `false`

#### Phase 2: 前端整合

1. **封裝 Service (`src/services/configService.ts`)**:

   ```typescript
   import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
   
   export const initConfig = async () => {
     const remoteConfig = getRemoteConfig();
     remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1小時快取
     await fetchAndActivate(remoteConfig);
   };
   
   export const getFeatureFlag = (key: string) => {
     return getValue(getRemoteConfig(), key).asBoolean();
   };
   ```

#### Phase 3: UI 綁定

1. 在 Vue Component 中使用：

   ```typescript
   const showNewChat = computed(() => getFeatureFlag('enable_new_chat_ui'));
   ```

2. **實作 Loading 狀態**: Remote Config 載入需要時間，初始載入時應顯示 Skeleton 或使用預設值。

#### Phase 4: 灰度發布 (Canary)

1. 在 Console 設定 **Conditions** (條件)：
   - `User in Random Percentile <= 10%`: `enable_new_chat_ui` = `true`.
2. 觀察 Crashlytics 與 Analytics 確保新功能穩定。
