<template>
    <span :class="statusClass" class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center">
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
      case 'empty': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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