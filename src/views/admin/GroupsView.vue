<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Group Management</h2>
      <div class="space-x-2">
        <input type="text" placeholder="Search groups..." class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">Group Name</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">Service</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="group in groups" :key="group.id" class="hover:bg-gray-50">
            <td class="p-4 font-medium text-gray-800">{{ group.name }}</td>
            <td class="p-4 text-gray-600">{{ group.service }}</td>
            <td class="p-4 text-gray-600">${{ group.price }}/mo</td>
            <td class="p-4">
              <span class="px-2 py-1 text-xs rounded-full" 
                :class="group.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ group.status }}
              </span>
            </td>
            <td class="p-4">
              <button class="text-red-600 hover:text-red-800 text-sm font-medium">Terminate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const groups = ref([
  { id: 1, name: 'Netflix 4k Family', service: 'Netflix', price: '390', status: 'Active' },
  { id: 2, name: 'Spotify Prem', service: 'Spotify', price: '268', status: 'Active' },
  { id: 3, name: 'Disney Plus Fun', service: 'Disney+', price: '270', status: 'Filled' },
  { id: 4, name: 'Youtube Premium', service: 'YouTube', price: '179', status: 'Active' },
])
</script>
