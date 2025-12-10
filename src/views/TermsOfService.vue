<template>
  <LegalLayout title="服務條款 (Terms of Service)">
    <section>
      <h2 class="text-xl font-semibold text-white mb-2">1. 服務簡介</h2>
      <p>「拼團小幫手」(以下簡稱本服務) 提供一個資訊媒合平台，協助使用者尋找合購串流服務的夥伴。本服務僅提供資訊交流與群組管理工具，不涉及任何金流處理。</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">2. 免責聲明</h2>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-2">
        <li><strong>金流風險</strong>：本服務不處理任何金流交易。所有付款行為皆發生於使用者之間私下約定 (如轉帳、街口等)。若發生詐欺或金錢糾紛，本服務不負任何賠償責任。</li>
        <li><strong>帳號共用風險</strong>：共用串流帳號可能違反部分串流平台的使用條款。使用者需自行承擔帳號被封鎖或終止服務的風險。</li>
        <li><strong>資料正確性</strong>：拼團資訊由使用者自行發布，本服務不保證其內容之真實性與準確性。</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">3. 使用者規範</h2>
      <p>您同意在使用本服務時遵守以下規範：</p>
      <ul class="list-disc list-inside ml-4 mt-2">
        <li>不得發布虛假、詐欺、騷擾或違法的內容。</li>
        <li>不得惡意棄單或在收取費用後未提供相應服務。</li>
        <li>如經檢舉發現有惡意行為，我們保留隨時停權或刪除帳號的權利。</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">4. 條款變更</h2>
      <p>我們保留隨時修改本服務條款的權利。重大變更將於網站上公告。繼續使用本服務即代表您同意受修訂後的條款約束。</p>
    </section>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
</script>
