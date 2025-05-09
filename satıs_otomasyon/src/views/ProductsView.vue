<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Ürünler</h1>
      
      <!-- Arama ve Filtreleme -->
      <div class="mb-8">
        <ProductSearch v-model:searchQuery="searchQuery" />
        <CategoryFilter 
          :categories="productStore.categories" 
          :selectedCategory="productStore.selectedCategory"
          @select-category="selectCategory"
        />
      </div>
      
      <!-- Ürün Listesi -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
      
      <!-- Sonuç Bulunamadı -->
      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <Search class="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        <button @click="resetFilters" class="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
          Filtreleri Sıfırla
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { Search } from 'lucide-vue-next';
  import { useProductStore } from '../stores/product';
  import { useCartStore } from '../stores/cart';
  import ProductCard from '../components/ProductCard.vue';
  import CategoryFilter from '../components/CategoryFilter.vue';
  import ProductSearch from '../components/ProductSearch.vue';
  
  const productStore = useProductStore();
  const cartStore = useCartStore();
  
  const searchQuery = ref('');
  
  // Kategori seçimi
  const selectCategory = (category) => {
    productStore.setSelectedCategory(category);
  };
  
  // Filtrelenmiş ürünler
  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    
    
    return productStore.filteredProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descriptionMatch = product.description.toLowerCase().includes(query);
      
      if (!query) {
          return true;
      }
  
      return nameMatch || descriptionMatch;
    });
  });
  
  // Filtreleri sıfırla
  const resetFilters = () => {
    searchQuery.value = '';
    productStore.setSelectedCategory('all');
  };
  
  // Sepete ekleme
  const addToCart = (product) => {
    cartStore.addItem(product);
  };
  </script>