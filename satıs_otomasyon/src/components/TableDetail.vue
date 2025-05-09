<template>
    <div class="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-gray-50 p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">{{ table.name }}</h2>
            <StatusBadge :status="table.status" class="ml-2" />
          </div>
          <div class="flex space-x-2">
            <button 
              @click="$emit('open-product-selection')" 
              class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center"
            >
              <PlusCircle class="h-5 w-5 mr-1" />
              Ürün Ekle
            </button>
            <button 
              v-if="table.status !== 'empty'" 
              @click="$emit('complete-order')" 
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <CheckCircle class="h-5 w-5 mr-1" />
              Siparişi Tamamla
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="table.status !== 'empty'" class="p-4">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Ürün</th>
              <th class="text-center py-2">Adet</th>
              <th class="text-right py-2">Fiyat</th>
              <th class="text-right py-2">Toplam</th>
              <th class="text-right py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in table.items" :key="item.id" class="border-b hover:bg-gray-50">
              <td class="py-3">{{ item.name }}</td>
              <td class="text-center py-3">{{ item.quantity }}</td>
              <td class="text-right py-3">{{ item.price.toFixed(2) }} ₺</td>
              <td class="text-right py-3">{{ (item.price * item.quantity).toFixed(2) }} ₺</td>
              <td class="text-right py-3">
                <button @click="$emit('remove-item', item.id)" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                  <Trash2 class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right font-bold py-3">Toplam:</td>
              <td class="text-right font-bold py-3">{{ table.total.toFixed(2) }} ₺</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div v-else class="p-8 text-center">
        <Coffee class="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p class="text-gray-500">Bu masada henüz sipariş bulunmamaktadır.</p>
        <button 
          @click="$emit('open-product-selection')" 
          class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center"
        >
          <PlusCircle class="h-5 w-5 mr-1" />
          Ürün Ekle
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Trash2, PlusCircle, CheckCircle, Coffee } from 'lucide-vue-next';
  import StatusBadge from '@/components/StatusBadge.vue';
  
  defineProps({
    table: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['open-product-selection', 'complete-order', 'remove-item']);
  </script>