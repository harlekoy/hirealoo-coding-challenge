<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Portable Toilet Service Scheduler</h1>
        <p class="text-gray-600">Configure service frequencies and custom schedules</p>
      </div>
      
      <ServiceFrequency 
        v-model:scheduleConfig="scheduleConfig"
        @update:scheduleConfig="handleScheduleUpdate"
      />
      
      <!-- Additional Demo Info -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>This component demonstrates the service frequency configuration for portable toilets.</p>
        <p>Select different options to see how the JSON configuration changes.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scheduleConfig = ref('')

const handleScheduleUpdate = (newConfig: string) => {
  scheduleConfig.value = newConfig
  console.log('Schedule config updated:', newConfig)
}
</script>