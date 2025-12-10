<template>
  <div class="h-full w-full p-4">
    <h1 class="text-2xl font-bold mb-4">拼團公佈欄</h1>
    <p>Welcome to Subscription Buddy!</p>
  </div>
</template>

<script setup>
import { useGroupStore } from '../stores/groupStore'
const groupStore = useGroupStore()
</script>
