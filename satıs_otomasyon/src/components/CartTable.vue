<template>
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
        <tr v-for="item in items" :key="item.id" class="border-b">
          <td class="py-2">{{ item.name }}</td>
          <td class="text-center py-2">
            <div class="flex items-center justify-center space-x-2">
              <button @click="$emit('decrease', item)" class="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                <Minus class="h-4 w-4" />
              </button>
              <span>{{ item.quantity }}</span>
              <button @click="$emit('increase', item)" class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Plus class="h-4 w-4" />
              </button>
            </div>
          </td>
          <td class="text-right py-2">{{ item.price.toFixed(2) }} ₺</td>
          <td class="text-right py-2">{{ (item.price * item.quantity).toFixed(2) }} ₺</td>
          <td class="text-right py-2">
            <button @click="$emit('remove', item.id)" class="text-red-500 hover:text-red-700">
              <Trash2 class="h-4 w-4" />
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-right font-bold py-2">Toplam:</td>
          <td class="text-right font-bold py-2">{{ total.toFixed(2) }} ₺</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </template>
  
  <script setup>
  import { Trash2, Plus, Minus } from 'lucide-vue-next';
  
  defineProps({
    items: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  });
  
  defineEmits(['increase', 'decrease', 'remove']);
  </script>