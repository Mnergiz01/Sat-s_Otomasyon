<template>
    <span 
      :class="statusClass" 
      class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center"
    >
      <span :class="dotClass" class="w-2 h-2 rounded-full mr-1"></span>
      {{ statusText }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    status: {
      type: String,
      required: true
    }
  });
  
  const statusClass = computed(() => {
    switch(props.status) {
      case 'empty': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'active': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  });
  
  const dotClass = computed(() => {
    switch(props.status) {
      case 'empty': return 'bg-green-500';
      case 'active': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  });
  
  const statusText = computed(() => {
    switch(props.status) {
      case 'empty': return 'Boş';
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      default: return '';
    }
  });
  </script>