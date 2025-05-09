<template>
    <div class="mb-6">
      <div class="relative">
        <input 
          type="text" 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Ürün ara..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Search } from 'lucide-vue-next';
  
  defineProps({
    searchQuery: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['update:searchQuery']);
  </script>