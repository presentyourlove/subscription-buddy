# Threat Model Report (威脅建模報告)

**Target System**: Subscription Buddy (合購夥伴)
**Methodology**: STRIDE
**Date**: 2026-01-18
**Status**: [Living Document]

---

## 1. System Overview

Subscription Buddy 是一個協助使用者尋找串流媒體合購夥伴的平台。核心功能包含：

* **Authentication**: Firebase Auth (Email/Google).
* **Group Matching**: Firestore (CRUD), Fuzzy Search.
* **Secure Messaging**: Real-time Chat with E2EE (RSA+AES).

### Core Data Flow (DFD Summary)

1. **User** <-> **Client (Vue App)**: 輸入憑證、訊息、個資。
2. **Client** <-> **Firebase Auth**: 交換 ID Token。
3. **Client** <-> **Firestore**: 讀寫 Group/Chat 資料 (透過 Security Rules 控管)。
4. **Client** <-> **Cloud Functions**: 觸發後端邏輯 (如通知、清理)。

---

## 2. STRIDE Analysis

我們針對 **Client** 與 **Firestore/Backend** 之間的邊界進行分析。

| Category | Definition | Potential Threat (Subscription Buddy) | Mitigation Strategy (Current/Planned) | Risk |
| :--- | :--- | :--- | :--- | :--- |
| **S**poofing | 冒充他人身分 | 1. 攻擊者竊取 Token 偽裝成合法使用者。<br>2. 惡意腳本模擬 API 請求 (Bot)。 | 1. **Auth**: 強制 HTTPS，Token 短效期 (Firebase 預設)。<br>2. **[P0] App Check**: 引入 reCAPTCHA Enterprise 驗證客戶端完整性。 | High |
| **T**ampering | 竄改資料 | 1. 修改 HTTP Payload 嘗試提升權限 (e.g. `role: admin`)。<br>2. 修改 Firestore 訊息時間戳記。 | 1. **Rules**: Firestore Security Rules 嚴格驗證欄位型別與長度。<br>2. **[Done] Timestamp Guard**: 強制使用 `request.time`。 | High |
| **R**epudiation | 抵賴 (否認行為) | 1. 使用者惡意棄單或辱罵後刪除帳號，並否認操作。<br>2. 缺乏操作紀錄。 | 1. **Audit**: 關鍵操作 (Join/Leave/Rate) 寫入 Immutable Log。<br>2. **Soft Delete**: 刪除帳號時僅標記狀態，保留證據一段時間 (需符合 GDPR)。 | Medium |
| **I**nformation Disclosure | 資訊洩漏 | 1. API 回傳過多個資 (e.g. 全部人的 Email)。<br>2. Log 紀錄明文密碼或 Token。 | 1. **Rules**: 透過 `resource.data` 限制僅能讀取公開欄位。<br>2. **[P0] PII Masking**: 實作 Logger 遮罩敏感資訊。 | High |
| **D**enial of Service | 阻斷服務 | 1. 惡意刷 API (e.g. 無限建立 Group) 耗盡 Quota。<br>2. 上傳超大圖片塞爆 Storage。 | 1. **[Done] Rate Limiting**: 限制寫入頻率。<br>2. **Validation**: 限制上傳檔案大小 (e.g. < 2MB) 與格式。 | Medium |
| **E**levation of Privilege | 權限提升 | 1. 一般成員嘗試踢出其他成員。<br>2. 存取 Admin 後台 API。 | 1. **Rules**: `allow update: if request.auth.uid == resource.data.ownerId`。<br>2. **Claims**: 使用 Custom Claims 標記 Admin，而非依賴前端參數。 | Critical |

---

## 3. Risk Assessment & Roadmap

### High Priority Risks (P0)

1. **Bot / Abuse Trafic (Spoofing/DoS)**
    * **Action**: 確認 **App Check** 已全面啟用並生效。
2. **Sensitive Data Leak (Information Disclosure)**
    * **Action**: 加速 **PII Masking Middleware** 的開發與部署。
3. **Data Integrity (Tampering)**
    * **Action**: 持續完善 Firestore Rules 單元測試。

### Conclusion

目前的架構設計已針對主要威脅 (特別是 E2EE 與 Access Control) 進行防護。
剩餘風險主要集中在 **自動化攻擊 (Bots)** 與 **日誌隱私 (Logs)**，這正是我們目前 Roadmap (P0 Tasks) 的執行重點。
