<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">1,234</p>
        <span class="text-green-500 text-sm">↑ 12% from last month</span>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">Active Groups</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">56</p>
        <span class="text-green-500 text-sm">↑ 5 new today</span>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">Pending Reports</h3>
        <p class="text-3xl font-bold text-orange-600 mt-2">3</p>
        <span class="text-gray-400 text-sm">Needs attention</span>
      </div>
    </div>

    <!-- Recent Activity Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-bold mb-4">System Alerts</h3>
      <div class="p-4 bg-blue-50 text-blue-700 rounded-md">
        System is running smoothly. No critical errors loaded.
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
