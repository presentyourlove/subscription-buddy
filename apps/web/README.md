# Subscription Buddy (合購夥伴)

![Vue.js](https://img.shields.io/badge/Vue.js-3.0+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-Ready-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Subscription Buddy** 是一個專為尋找串流媒體合購夥伴打造的媒合平台。解決了「找不到人分擔 Netflix / Spotify 家庭方案」的痛點，提供一個安全、透明且即時的媒合環境。

---

## 🌟 專案亮點 (Project Highlights)

* **⚡ 極致效能**: 基於 **Vite + Vue 3** 構建，秒級載入，流暢的 SPA 體驗。
* **🛡️ 安全優先**: 實作 **E2E Encryption** (端對端加密) 與 **GDPR** 資料自主權，達到企業級資安標準。
* **📱 完美適配**: 支援 **PWA** (Progressive Web App)，具備 iOS 瀏海適配、手勢操作與離線存取能力。
* **💬 即時互動**: 整合 **Firebase Firestore** 實作即時聊天室，無須重新整理頁面。
* **🌍 全面國際化**: 內建完整 **i18n** 支援 (繁體中文/English)，無 Hardcoded 字串。

---

## ✨ 功能特色 (Features)

* **身分驗證**: 支援 Email/Password 註冊登入與 Google 快速登入 (OAuth)。
* **拼團廣場**:
  * **開團**: 快速發起 Netflix, Disney+, Spotify 等服務的合購團。
  * **搜尋**: 支援模糊搜尋 (Fuzzy Search)，即時找到感興趣的拼團。
  * **狀態**: 自動判斷「招募中」、「已滿團」或「已結團」。
* **隱私通訊**:
  * **E2EE**: 聊天室訊息採用 **RSA + AES** 混合加密，伺服器無法窺探內容。
  * **安全性**: 支援訊息發送、加入/退出通知。
* **信譽評價**: 交易完成後互評機制，建立社群信任度。
* **個資自主**: 支援一鍵匯出個人資料 (JSON) 與徹底刪除帳號 (Right to be Forgotten)。

---

## 💎 程式碼品質 (Code Quality)

本專案嚴格遵循現代前端開發規範：

* **Type Safety**: 全面導入 **TypeScript**，提供嚴格的型別檢查。
* **Architecture**: 嚴格遵守 **View - Store - Service** 分層架構，邏輯清晰。
* **Linting / Formatting**: 整合 **ESLint**, **Prettier** 與 **Husky** (Git Hooks)，確保程式碼一致性。
* **Testing**: 包含 **Vitest** (單元測試) 與 **Playwright** (E2E 測試)。
* **Accessibility**: 符合 **WCAG 2.1** 標準，並通過 `pa11y-ci` 自動化稽核。
* **CI/CD Ready**: 包含 Dockerfile 與健康檢查指令，支援容器化部署。

---

## 🚀 快速開始 (Quick Start)

### 1. 安裝依賴

本專案採用 **Monorepo** 架構，請確保安裝 `pnpm`：

```bash
npm install -g pnpm
pnpm install
```

### 2. 環境設定

複製範例設定檔並填入您的 Firebase Config：

```bash
cp apps/web/.env.example apps/web/.env
```

### 3. 啟動開發伺服器

```bash
pnpm dev
# 這將同時啟動 Web App 與 Cloud Functions (模擬器)
```

瀏覽器打開 `http://localhost:5173` 即可看見畫面。

---

## 📱 支援平台 (Supported Platforms)

| Platform | Support Type | Details |
| :--- | :--- | :--- |
| **Web** | Modern Browsers | Chrome, Firefox, Safari, Edge |
| **Android** | PWA / TWA | 支援 add-to-home screen, TWA 打包上架 Play Store |
| **iOS** | PWA / WebClip | 支援 Safari add-to-home, Fullscreen display (manifest) |
| **Desktop** | Web / Electron | 響應式網頁，未來可封裝為 Electron App |

---

## 🛠️ 技術堆疊 (Technology Stack)

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript | Strong Typing & Modern ES Features |
| **Frontend** | Vue 3 | Composition API |
| | Vite | Next Generation Frontend Tooling |
| | TailwindCSS | Utility-first CSS Framework (Dark Mode support) |
| | Pinia | Intuitive State Management |
| | Vue I18n | Internationalization plugin |
| **Backend** | Firebase | Auth, Firestore, Hosting, Analytics |
| **Security** | Web Crypto API | Native Browser Cryptography for E2EE |
| **PWA** | vite-plugin-pwa | Offline Support & Installable |
| **Testing** | Vitest | Blazing Fast Unit Test Framework |
| | Playwright | Reliable End-to-End Testing |
| **DevOps** | Docker | Containerization |

---

## 🏗️ 專案結構 (Project Structure)

pnpm-workspace.yaml
apps/
├── web/            # 前端應用 (Vue 3 + Vite)
├── functions/      # 後端函數 (Firebase Cloud Functions)
packages/
└── core/           # 共用核心邏輯 (Auth, Services, Types)
    ├── src/
    │   ├── schemas/    # Zod 驗證 Schema
    │   ├── services/   # 商業邏輯服務層
    │   ├── types/      # TypeScript 型別定義
    │   └── utils/      # 共用工具函式 (Logger, Constants)

---

## 📖 開發指南 (Development Guide)

1. **新增頁面**: 在 `src/views` 建立 `.vue` 檔，並於 `src/router/index.js` 註冊路由。
2. **新增狀態**: 在 `src/stores` 建立 Store，處理全域資料流。
3. **資料存取**: 所有資料庫操作請寫在 `src/services`，禁止在 Component 直接呼叫 Firebase SDK。
4. **樣式開發**: 優先使用 Tailwind Utility Classes，特殊需求才寫在 `<style>`.
5. **提交規範**: 遵循 **Conventional Commits** (e.g. `feat: add chat`, `fix: login error`)。

---

## 🧪 測試 (Testing)

### Web 測試

* **單元測試**: `npm test` (Vitest)
* **E2E 測試**: `npx playwright test`

### Mobile 測試 (Android/iOS)

建議使用真實裝置或模擬器進行驗證，特別關注：

1. **PWA 安裝**: 檢查 Manifest 是否正確載入。
2. **安全區域**: 檢查劉海 (Notch) 與 Home Indicator 是否遮擋內容 (Safe Area)。
3. **手勢操作**: 測試 Pull-to-Refresh 與滑動順暢度。

---

## 📦 打包發布 (Build & Publish)

### Web / PWA

建置生產版本 (自動生成 Service Worker):

```bash
npm run build
```

產物位於 `dist/` 資料庫，可直接部署至 Firebase Hosting 或 Nginx。

### Android (APK)

使用 **Bubblewrap** 或 **Trusted Web Activities (TWA)** 將 PWA 打包為 APK:

```bash
# 需安裝 bubblewrap
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest
bubblewrap build
```

### iOS (WebClip/IPA)

iOS 主要透過 Safari "Add to Home Screen" 安裝。若需上架 App Store，需透過 **Cordova** 或 **Capacitor** 封裝 Web App。

---

## 📚 API 文件與測試 (API Documentation)

本專案採用 **Serverless** 架構，核心邏輯封裝於前端 Service Layer：

* **AuthService**: `src/services/authService.ts` - 處理登入、註冊、登出。
* **GroupService**: `src/services/groupService.ts` - 拼團 CRUD 與搜尋。
* **ChatService**: `src/services/ChatService.ts` - 聊天室管理 (支援 E2EE Payload 處理)。
* **CryptoService**: `src/services/CryptoService.ts` - 負責 RSA/AES 加解密運算。
* **PrivacyService**: `src/services/PrivacyService.ts` - GDPR 資料匯出與刪除。

測試策略建議針對上述 Service 撰寫 Integration Tests (連接 Firebase Emulator)。

---

## 🛡️ 安全防護 (Security Ops)

### 容器弱點掃描 (Container Scanning)

本專案集成了 [Trivy](https://aquasecurity.github.io/trivy/) 以確保交付的 Docker Image 安全無虞。

**前置需求**: 請安裝 Trivy (Windows: `winget install -e --id AquaSecurity.Trivy` 或 `choco install trivy`)

**執行掃描**:

```bash
npm run scan:image
```

這將自動執行：

1. 建置生產環境 Docker Image (`subscription-buddy:latest`)
2. 掃描 Image 中的 OS 套件與 Application 依賴漏洞
3. 輸出 CVE 報告 (請優先修復 `CRITICAL` 與 `HIGH` 等級漏洞)

---

## 🔮 未來規劃 (Future Roadmap)

基於專案現況與未來擴展需求，我們擬定以下分階段優化藍圖：

#### 🛠️ 開發體驗與架構 (DevEx & Architecture)

1. **架構模組化 (Monorepo Refactoring)** `[V3]`
    * **描述**: 當商業邏輯複雜化時，將 `core` (Model/Service) 與 `ui` (View) 分離為不同 Package。
    * **效益**: 提升編譯速度，並允許邏輯在不同專案 (如 Admin 後台) 間共用。

2. **架構決策記錄 (Architecture Decision Records - ADR)** `[P2]`
    * **描述**: 建立 `doc/adr` 目錄，記錄所有重大架構決策的背景、選項與後果 (Core Rules 9.5)。
    * **效益**: 保存架構演進脈絡，避免團隊成員重複辯論已決定的議題。

3. **設計系統文件化 (Design System Documentation)** `[P2]`
    * **描述**: 完善 **Storybook**，建立色彩、排版與元件庫的標準使用文件 (Core Rules 4.1)。
    * **效益**: 確保 UI/UX 一致性，降低新進開發者上手門檻。

4. **架構分層強制檢測 (Strict Layer Enforcement)** `[P2]`
    * **描述**: 引入 **Dependency Cruiser**，於 CI 階段強制檢查依賴關係 (e.g. 禁止 View 直接 import Service)。
    * **效益**: 防止架構腐化 (Architecture Erosion)，維持專案長期可維護性。

5. **複雜度監控 (Cognitive Complexity Monitoring)** `[P3]`
    * **描述**: 設定 SonarCloud 閥值，強制單一函式 Cognitive Complexity < 15 (Core Rules 1.1)。
    * **效益**: 降低代碼閱讀負擔，減少邏輯錯誤滋生。

#### 🛡️ 安全性與維運 (Security & DevOps)

1. **自動化備份與還原演練 (Automated Backup & DR)** `[V3]`
    * **描述**: 設定 Cloud Scheduler 定期備份 Firestore 至 Cloud Storage，並撰寫還原腳本。
    * **效益**: 符合企業級備援策略 (Backup Strategy)，確保災難發生時的 RTO/RPO 達標。

2. **零信任架構 (Zero Trust - App Check)** `[V3]`
    * **描述**: 全面啟用 **Firebase App Check**，驗證流量來源是否為合法的 App 或 Web 客戶端 (Security Rules 1).
    * **效益**: 有效阻擋非法的 API 爬蟲與未經授權的後端存取。

3. **資料庫遷移版本控制 (Database Migration Versioning)** `[V3]`
    * **備註**: 已規畫實作計畫 (Node.js Runner)，但延後至 V3 執行。
    * **描述**: 撰寫 Node.js 腳本配合 CI/CD，對 Firestore 進行資料結構變更的版本控制 (Backend Rules 4.5)。
    * **效益**: 確保所有環境 (Dev/Staging/Prod) 的資料結構一致，並支援自動化回滾 (Rollback)。

4. **雲端金鑰管理 (Cloud Secret Manager)** `[V3]`
    * **描述**: 移除 `.env` 檔案中的機敏資訊，改接 Google Secret Manager 或 AWS Parameter Store (Core Rules 2.1)。
    * **效益**: 杜絕金鑰誤上傳 Git 的風險，並支援金鑰輪替 (Rotation) 與審計。

5. **提交前機敏資料掃描 (Pre-commit Secret Scanning)** `[V3]`
    * **描述**: 設定 **GitHooks** (使用 **git-secrets** 或 **detect-secrets**)，在 Commit 階段攔截潛在的 API Key 或密碼 (SecOps).
    * **效益**: 構建第一道防線，防止機敏資料汙染版本控制系統。

6. **自動化動態弱點掃描 (DAST - OWASP ZAP)** `[V3]`
    * **描述**: 於 CI/CD Pipeline 整合 **OWASP ZAP**，對測試環境進行自動化滲透測試 (Enterprise Security).
    * **效益**: 提早發現 SQL Injection、XSS 等 runtime 後才顯現的安全漏洞。

#### 🧪 測試與品質保證 (Testing & QA)

1. **全面單元測試覆蓋 (Unit Testing Coverage)** `[P1]`
    * **描述**: 提升核心商業邏輯 (Composables, Services) 的測試覆蓋率至 > 80% (Core Rules 10.1)。
    * **效益**: 降低回歸錯誤風險，建立穩固的持續交付流水線 (CI Pipeline)。

2. **視覺回歸測試 (Visual Regression Testing)** `[P2]`
    * **描述**: 於 CI 流程整合 **Percy** 或 **Chromatic**，自動偵測 UI 樣式與佈局的非預期變更 (Frontend Rules 2).
    * **效益**: 確保不同瀏覽器與裝置間的 UI 一致性 (Pixel-Perfect)，防止樣式崩壞。

3. **突變測試 (Mutation Testing)** `[P3]`
    * **描述**: 使用 **StrykerJS** 修改程式碼邏輯並執行測試，驗證測試個案是否能抓出錯誤 (Testing Rules).
    * **效益**: 找出「覆蓋率高但無效」的測試，確保測試套件的真實品質。

4. **自動化無障礙守門員 (Automated Accessibility Guardrails)** `[P1]`
    * **描述**: 將 `pa11y-ci` 整合至 Git Pre-commit Hook 或 CI Pipeline，強制阻擋不符合 WCAG 2.1 AA 的提交 (Frontend Rules 4).
    * **效益**: 確保產品對所有使用者 (含身障人士) 的友善度，降低法律訴訟風險。

5. **混沌工程演練 (Chaos Engineering)** `[P3]`
    * **描述**: 在測試環境模擬網路延遲、服務當機等極端狀況 (e.g. 使用 **Chaos Mesh**) (Enterprise Rules 4.3).
    * **效益**: 驗證系統的自我癒合能力 (Self-Healing) 與降級策略 (Fallback Strategies) 是否有效。

#### 📊 可觀測性 (Observability)

1. **集中式錯誤追蹤 (Centralized Error Tracking)** `[V3]`
    * **備註**: 已規畫實作計畫 (GCP Error Reporting)，但延後至 V3 執行。
    * **描述**: 整合 Sentry 或 Firebase Crashlytics，即時捕獲前端 Runtime Errors 與 API 異常。
    * **效益**: 提升 MTTR (平均修復時間)，主動發現使用者遭遇的體驗問題。

2. **分散式追蹤 (OpenTelemetry)** `[P1]`
    * **描述**: 導入 OpenTelemetry 標準，串聯前後端與 Firebase 服務的 Request Trace ID (Core Rules 8.2)。
    * **效益**: 可視化跨服務的呼叫路徑，快速定位效能瓶頸與錯誤根源。

3. **智慧告警整合 (Automated Alerting Integration)** `[V3]`
    * **備註**: 已規畫實作計畫 (GCP Monitoring Policies)，但延後至 V3 執行。
    * **描述**: 設定 PrometheusAlert 或 PagerDuty，針對關鍵指標 (如 Error Rate > 1%) 發送即時通知 (Core Rules 8.4)。
    * **效益**: 縮短事故響應時間 (MTTA)，實現 7x24 小時的主動維運監控。

4. **可視化監控儀表板 (Grafana Dashboards)** `[P2]`
    * **描述**: 搭建 Grafana 看板，將 Prometheus 指標與 OpenTelemetry 數據視覺化 (Core Rules 8.1)。
    * **效益**: 提供維運團隊 (SRE) 一目瞭然的系統健康狀態大屏。

5. **真實用戶監控 (RUM - Real User Monitoring)** `[P2]`
    * **描述**: 收集並分析真實使用者的 Core Web Vitals (LCP, FID, CLS) 數據 (Frontend Rules 2).
    * **效益**: 了解不同裝置與網路環境下的實際體驗，而非僅依賴實驗室數據 (Lighthouse)。

#### 🚀 極致效能優化 (Advanced Performance)

1. **SSR / SSG 架構遷移 (Server-Side Rendering)** `[P2]`
    * **描述**: 評估遷移至 **Nuxt 3** 或導入 **Vite SSR**。
    * **效益**: 顯著提升 SEO 排名與 First Contentful Paint (FCP) 指標，優化社群分享預覽 (OG Tags)。

2. **PWA 冷啟動優化 (Cold Start Optimization)** `[P1]`
    * **描述**: 針對行動裝置進行 Profile 分析，確保 TTI (Time to Interactive) < 2 秒 (Mobile Rules 4)。
    * **效益**: 提升 App 級別的流暢度，降低使用者跳出率。

3. **深度連結整合 (Deep Linking Integration)** `[P2]`
    * **描述**: 實作 **Universal Links (iOS)** 與 **App Links (Android)**，讓分享連結直接喚起 App 特定頁面 (Mobile Rules).
    * **效益**: 優化行銷漏斗與使用者體驗，提升外部流量轉化率。

4. **生物辨識登入 (WebAuthn / Passkeys)** `[P3]`
    * **描述**: 導入 **WebAuthn** 標準，支援 FaceID / TouchID 進行無密碼登入 (Security Rules 2.5)。
    * **效益**: 提升登入體驗與帳號安全性，降低釣魚攻擊風險。

5. **語系資源懶加載 (i18n Lazy Loading)** `[P2]`
    * **描述**: 將多國語系檔拆分為獨立 Chunk，僅在使用者切換語言時動態載入。
    * **效益**: 減少初始 Bundle Size，加快首屏載入速度 (FCP)。

6. **效能守門員 (Lighthouse CI Guardrails)** `[P1]`
    * **描述**: 於 CI Pipeline 強制執行 Lighthouse 檢測，若 Score < 90 則阻擋 Merge (Frontend Rules 2)。
    * **效益**: 杜絕效能退化 (Performance Regression)，確保應用程式始終保持高效能標準。

7. **圖片自動優化管道 (Automated Image Optimization)** `[P2]`
    * **描述**: 利用 Cloud Functions 觸發器，在使用者上傳圖片時自動轉檔為 **WebP/AVIF** 並生成多種尺寸 (Frontend Rules 2.2)。
    * **效益**: 大幅減少傳輸流量，提升 LCP (Largest Contentful Paint) 效能指標。

8. **CDN 邊緣快取策略 (Edge Caching Strategy)** `[P1]`
    * **描述**: 精細配置 Firebase Hosting 的 `Cache-Control` 標頭，將靜態資源快取於全球邊緣節點 (Performance Rules).
    * **效益**: 最小化伺服器回源請求，實現全球毫秒級的內容傳遞。

9. **打包體積預算 (Bundle Size Budget)** `[P2]`
    * **描述**: 於 Vite 配置 `performance.maxAssetSize`，若單一 Chunk 超過 300KB 則構建失敗 (Frontend Rules 3)。
    * **效益**: 建立硬性效能門檻 (Performance Budget)，防止隨著功能迭代導致的體積膨脹。

10. **前端錯誤邊界 (Frontend Error Boundaries)** `[P1]`
    * **描述**: 利用 Vue 3 `onErrorCaptured` hook 實作元件級錯誤隔離，避免單一組件崩潰導致白屏 (Genral Principles 3).
    * **效益**: 顯著提升應用程式韌性 (Resilience)，提供優雅的降級 UI (Graceful Degradation)。

11. **斷路器模式 (Circuit Breaker Pattern)** `[P1]`
    * **描述**: 於前端 Service Layer 實作 **Circuit Breaker** (使用 **Opossum**)，當後端錯誤率過高時自動熔斷 (Enterprise Resilience).
    * **效益**: 防止雪崩效應 (Cascading Failures)，並提供即時的 Fallback 回應，保護後端服務。

---

---

## 📝 最新更新 (Latest Updates)

### Security Enhancements (2026-01-18)

* **API Rate Limiting**:
  * 全面啟用 **Firebase App Check** (reCAPTCHA Enterprise)，阻擋非瀏覽器流量。
  * 實作 **Firestore Timestamp Guard**，強制校驗伺服器時間 (`request.time`)。
* **Container Security**:
  * 整合 **Trivy** 容器弱點掃描工具 (`npm run scan:image`)。
  * 優化 Dockerfile 建置流程，修復與 `vue-tsc` 的相容性問題。
* **Type Safety & Bug Fixes**:
  * 修復 `ChatService` 與 `GroupStore` 的 TypeScript 型別定義。
  * 解決 Service Worker 與 PWA (`ExtendableEvent`) 的全域型別衝突。

### Security Hardening (2026-01-25)

* **Code Security & Compliance**:
  * 修復 13+ **SonarCloud Security Hotspots**，達成 Quality Gate 100% 通過。
  * 移除 Git 中誤傳的編譯檔案 (`apps/functions/lib`)，消除潛在的 ReDoS 與 Weak Cryptography 風險。
  * 強化 **Secrets Management**，修復單元測試中的 Hardcoded Credentials。
* **Infrastructure Security**:
  * 啟用 Google Cloud Storage **Versioning** (版本控制) 與 **Access Logging** (存取日誌)。
  * 更新 `firestore.rules`，強制 `/groups` 與 `/users` 需驗證身分 (`request.auth != null`) 才可讀取。
* **Application Security**:
  * 實作 **Secure Headers** (Helmet)，禁用 `X-Powered-By`。
  * 部署 **Content Security Policy (CSP)** 於 `index.html`。
  * 修復前端 `target="_blank"` 的 Reverse Tabnabbing 漏洞 (`rel="noopener noreferrer"`)。
  * 修復 Logger Regex，防範 **ReDoS** 攻擊。

### Roadmap Features Implementation (2026-01-25)

* **Data Lifecycle (GDPR)**:
  * 實作 **Firestore TTL** (`apps/web/infra/terraform`), 設定 `expireAt` 自動清理過期日誌 (30天) 與通知 (90天)。
  * 系統自動化遵循資料最小化原則，無需額外維護成本。
* **Quality Assurance**:
  * 導入 **Pact** (Contract Testing) 於 CI 流程，確保前後端 API 契約一致性。
  * 建立 Consumer (`apps/web`) 與 Provider (`apps/functions`) 雙向驗證機制。
* **Feature Management**:
  * 整合 **Firebase Remote Config** (`configService.ts`)，實作功能開關與灰度發布能力。

### Advanced Features Implementation (2026-01-25)

* **Documentation & API**:
  * 實作 **Automated API Docs** (`tsoa` + `Swagger UI`)，確保文件與程式碼同步。
* **User Engagement**:
  * 實作 **Web Push Notifications** (FCM + Service Worker)，支援離線背景推播。
* **Data Intelligence**:
  * 整合 **BigQuery Warehouse** (Firebase Extensions)，支援 SQL 即時分析。
* **Architecture**:
  * 導入 **Event-Driven Architecture** (Pub/Sub)，解耦核心邏輯與 Side Effects。

### Security & Ops Implementation (2026-01-25)

* **Ops Excellence**:
  * 實作 **Cloud Budget Monitoring** (Terraform) 與 **Disaster Recovery** 備份腳本。
  * 實作 **Graceful Shutdown** 機制，確保服務平滑重啟。
* **Compliance & Safety**:
  * 整合 **License Compliance Scanning** (`license-checker`) 於 CI 流程。
  * 實作 **AI Content Moderation** (Cloud Vision)，自動過濾不當圖片。

## 👤 作者 (Author)

**Presentyourlove**

---

## ❤️ 致謝 (Acknowledgment)

* 感謝 **Vue.js** 與 **Vite** 團隊提供優秀的開發體驗。
* 感謝 **Firebase** 提供強大的後端基礎設施。
* 特別感謝開源社群提供的優秀 UI 元件與工具庫。
