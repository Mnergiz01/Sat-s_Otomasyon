<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Masa Seçimi</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="table in tables" :key="table.id" 
               class="border rounded p-3 cursor-pointer"
               :class="{'border-primary': selectedTable === table.id}"
               @click="$emit('select', table.id)">
            <div class="flex justify-between items-center">
              <h3 class="font-medium">{{ table.name }}</h3>
              <StatusBadge :status="table.status" />
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="$emit('close')" class="border border-gray-300 px-4 py-2 rounded">
            İptal
          </button>
          <button @click="$emit('transfer')" :disabled="!selectedTable" 
                  :class="{'bg-primary text-white': selectedTable, 'bg-gray-300 text-gray-500': !selectedTable}"
                  class="px-4 py-2 rounded">
            Aktar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { X } from 'lucide-vue-next';
  import StatusBadge from './StatusBadge.vue';
  
  defineProps({
    tables: {
      type: Array,
      required: true
    },
    selectedTable: {
      type: String,
      default: null
    }
  });
  
  defineEmits(['close', 'select', 'transfer']);
  </script>