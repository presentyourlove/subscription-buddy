<template>
  <footer class="bg-black/20 border-t border-white/5 py-8 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <div class="text-gray-400 text-sm order-2 md:order-1 flex flex-col md:flex-row gap-2">
          <span>&copy; {{ new Date().getFullYear() }} Sub-Buddy. All rights reserved.</span>
          <span class="hidden md:inline">|</span>
          <span>Designed by presentyourlove</span>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-6 text-sm order-1 md:order-2">
          <router-link to="/terms" class="text-gray-400 hover:text-white transition-colors">
            服務條款
          </router-link>
          <router-link to="/privacy" class="text-gray-400 hover:text-white transition-colors">
            隱私權政策
          </router-link>
          <a
            href="https://presentyourlove.github.io/apps_download_web/links.html"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors"
          >
            關於我們
          </a>
        </div>
      </div>

      <!-- Disclaimer (Small) -->
      <div class="mt-8 text-center md:text-left">
        <p class="text-xs text-gray-400">
          本網站僅為媒合平台，不介入任何金流交易。請使用者自行評估合購風險。
        </p>
      </div>
    </div>
  </footer>
</template>
