<template>
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Kategoriler</h2>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectCategory(category)"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="category === selectedCategory 
            ? 'bg-primary text-white' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
        >
          {{ formatCategoryName(category) }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['select-category']);
  
  const selectCategory = (category) => {
    emit('select-category', category);
  };
  
  const formatCategoryName = (category) => {
    if (category === 'all') {
      return 'Tümü';
    }
    return category;
  };
  </script>