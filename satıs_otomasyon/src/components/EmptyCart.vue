<template>
    <div class="bg-white rounded-lg shadow-md p-8 text-center">
      <ShoppingCart class="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500">Sepetiniz boş.</p>
      <router-link to="/" class="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
        Ürünlere Göz At
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ShoppingCart } from 'lucide-vue-next';
  </script>