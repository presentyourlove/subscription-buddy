<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex-shrink-0 hidden md:flex flex-col">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">{{ $t('admin.portal') }}</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/admin"
          class="block px-4 py-2 rounded text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          active-class="bg-indigo-50 text-indigo-600 font-medium"
        >
          {{ $t('admin.dashboard') }}
        </router-link>
        <router-link
          to="/admin/groups"
          class="block px-4 py-2 rounded text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          active-class="bg-indigo-50 text-indigo-600 font-medium"
        >
          {{ $t('admin.groups') }}
        </router-link>
        <router-link to="/" class="block px-4 py-2 mt-8 text-gray-500 hover:text-gray-700">
          ← {{ $t('admin.backToSite') }}
        </router-link>
      </nav>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 w-full bg-white shadow-sm z-10 p-4">
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-bold">{{ $t('app.title') }} Admin</h1>
        <router-link to="/" class="text-sm text-indigo-600">{{ $t('admin.exit') }}</router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8 mt-14 md:mt-0">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
