<template>
  <div class="max-w-4xl mx-auto px-4 py-12 text-gray-300">
    <h1 class="text-3xl font-bold text-white mb-8">隱私權政策 (Privacy Policy)</h1>
    
    <div class="space-y-6">
      <section>
        <h2 class="text-xl font-semibold text-white mb-2">1. 我們收集的資料</h2>
        <p>當您使用「拼團小幫手」(以下簡稱本服務) 時，我們會透過 Firebase Authentication 收集以下基本資訊：</p>
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>您的 Email 地址</li>
          <li>您的顯示名稱 (Display Name)</li>
          <li>您的頭像網址 (Photo URL)</li>
          <li>Firebase 賦予的唯一識別碼 (UID)</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mb-2">2. 資料使用用途</h2>
        <p>我們收集的資料僅用於以下目的：</p>
        <ul class="list-disc list-inside ml-4 mt-2">
          <li>識別您的使用者身份，以進行拼團管理與聊天功能。</li>
          <li>在拼團列表與聊天室中顯示您的頭像與暱稱，以便其他成員識別。</li>
          <li>紀錄您的信譽評分與過往拼團紀錄。</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mb-2">3. 資料分享與揭露</h2>
        <p>除以下情況外，我們不會將您的個人資料分享給第三方：</p>
        <ul class="list-disc list-inside ml-4 mt-2">
          <li><strong>拼團成員</strong>：當您加入拼團後，同團成員可以看到您的暱稱與頭像，作為溝通用途。</li>

        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mb-2">4. 資料安全</h2>
        <p>本服務使用 Google Firebase 提供的雲端基礎設施，您的資料皆儲存於 Google 的加密伺服器中。我們無法直接存取您的 Google 登入密碼。</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mb-2">5. 聯絡我們</h2>
        <p>若您對本隱私權政策有任何疑問，或希望刪除您的帳號資料，請透過 <a href="mailto:presentyourlove@yahoo.com" class="text-purple-400 hover:text-purple-300 underline">Email</a> 聯繫開發者。</p>
      </section>
      
      <div class="pt-8 text-center">
        <router-link to="/" class="text-purple-400 hover:text-purple-300 transition-colors">
          ← 返回首頁
        </router-link>
      </div>
    </div>
  </div>
</template>
