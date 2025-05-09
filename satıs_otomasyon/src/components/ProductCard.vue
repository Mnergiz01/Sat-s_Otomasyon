<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-lg font-semibold">{{ product.name }}</h2>
          <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{{ product.category }}</span>
        </div>
        <p class="text-gray-600 mb-3">{{ product.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold">{{ product.price.toFixed(2) }} ₺</span>
          <button @click="$emit('add-to-cart', product)" class="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors">
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    product: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['add-to-cart']);
  </script>