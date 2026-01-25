<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ $t('admin.groups') }}</h2>
      <div class="space-x-2">
        <input
          type="text"
          :placeholder="$t('admin.searchPlaceholder')"
          class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">
              {{ $t('admin.table.name') }}
            </th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">
              {{ $t('admin.table.service') }}
            </th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">
              {{ $t('admin.table.plan') }}
            </th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">
              {{ $t('admin.table.status') }}
            </th>
            <th class="p-4 text-xs font-medium text-gray-500 uppercase">
              {{ $t('admin.table.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="group in groups" :key="group.id" class="hover:bg-gray-50">
            <td class="p-4 font-medium text-gray-800">{{ group.name }}</td>
            <td class="p-4 text-gray-600">{{ group.service }}</td>
            <td class="p-4 text-gray-600">${{ group.price }}/{{ $t('home.card.month') }}</td>
            <td class="p-4">
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="
                  group.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{ group.status }}
              </span>
            </td>
            <td class="p-4">
              <button class="text-red-600 hover:text-red-800 text-sm font-medium">
                {{ $t('admin.table.terminate') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const groups = ref([
  { id: 1, name: 'Netflix 4k Family', service: 'Netflix', price: '390', status: 'Active' },
  { id: 2, name: 'Spotify Prem', service: 'Spotify', price: '268', status: 'Active' },
  { id: 3, name: 'Disney Plus Fun', service: 'Disney+', price: '270', status: 'Filled' },
  { id: 4, name: 'Youtube Premium', service: 'YouTube', price: '179', status: 'Active' }
])
</script>
