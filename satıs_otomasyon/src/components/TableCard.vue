<template>
    <div 
      class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
      :class="{
        'border-2 border-primary ring-2 ring-primary ring-opacity-50 transform scale-[1.02]': selected,
        'border border-gray-200': !selected
      }"
      @click="$emit('select', table)"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">{{ table.name }}</h2>
          <StatusBadge :status="table.status" />
        </div>
        <p v-if="table.status !== 'empty'" class="text-sm text-gray-600 font-medium">
          Toplam: {{ table.total.toFixed(2) }} ₺
        </p>
        <p v-else class="text-sm text-gray-500">
          Bu masa şu anda boş
        </p>
        
        <div v-if="table.status === 'active'" class="mt-2 text-xs text-gray-500">
          <p>{{ table.items.length }} ürün</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import StatusBadge from '@/components/StatusBadge.vue';
  
  defineProps({
    table: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['select']);
  </script>