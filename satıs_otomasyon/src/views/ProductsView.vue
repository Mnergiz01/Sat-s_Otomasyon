<template>
    <div>
      <!-- Üst Bilgi ve Filtreler -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-2xl font-bold">Ürünler</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Toplam {{ productStore.products.length }} ürün bulunmaktadır
          </p>
        </div>
        
        <!-- Arama ve Filtreler -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <!-- Arama -->
          <div class="relative flex-grow">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Ürün ara..." 
              class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
          
          <!-- Kategori Filtresi -->
          <div class="relative">
            <select 
              v-model="selectedCategory" 
              class="appearance-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
            >
              <option value="all">Tüm Kategoriler</option>
              <option v-for="category in productStore.uniqueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Kategori Hızlı Erişim -->
      <div class="mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <div class="flex space-x-2">
          <button 
            @click="selectedCategory = 'all'"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
            :class="selectedCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'"
          >
            Tümü
          </button>
          <button 
            v-for="category in productStore.uniqueCategories" 
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
            :class="selectedCategory === category 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- Ürün Listesi -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div class="relative">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute top-2 right-2">
              <span 
                class="px-2 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-800 text-primary shadow"
              >
                {{ product.price.toFixed(2) }} ₺
              </span>
            </div>
          </div>
          
          <div class="p-3">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                {{ product.category }}
              </span>
              <button 
                @click="addToCart(product)" 
                class="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Ürün bulunamadı -->
        <div v-if="filteredProducts.length === 0" class="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <Search class="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          <button @click="resetFilters" class="mt-4 text-primary hover:underline">
            Filtreleri Sıfırla
          </button>
        </div>
      </div>
      
      <!-- Sepete Eklendi Bildirimi -->
      <div 
        v-if="showAddedNotification" 
        class="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up"
      >
        <CheckCircle class="h-5 w-5" />
        <span>{{ addedProduct.name }} sepete eklendi</span>
      </div>
      
      <!-- Hızlı Sepet Erişimi -->
      <div 
        v-if="cartStore.totalItems > 0" 
        class="fixed bottom-4 left-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <router-link to="/cart" class="flex items-center space-x-2 text-primary">
          <ShoppingCart class="h-5 w-5" />
          <span>{{ cartStore.totalItems }} ürün - {{ cartStore.totalPrice.toFixed(2) }} ₺</span>
          <ChevronRight class="h-5 w-5" />
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { 
    Search, 
    X, 
    Plus, 
    CheckCircle, 
    ShoppingCart, 
    ChevronDown, 
    ChevronRight 
  } from 'lucide-vue-next';
  import { useProductStore } from '@/stores/product';
  import { useCartStore } from '@/stores/cart';
  import { onMounted } from 'vue';
  
  const productStore = useProductStore();
  const cartStore = useCartStore();
  
  // State
  const searchQuery = ref('');
  const selectedCategory = ref('all');
  const showAddedNotification = ref(false);
  const addedProduct = ref({});
  
  onMounted(() => {
    // Trigger the initial population of unique categories.
    productStore.uniqueCategories;
  });
  
  // Computed
  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    let filtered = productStore.products;
    
    // Kategori filtresi
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory.value);
    }
    
    // Arama filtresi
    if (query) {
      filtered = filtered.filter(product => {
        return product.name.toLowerCase().includes(query) || 
               product.description.toLowerCase().includes(query) ||
               product.category.toLowerCase().includes(query);
      });
    }
    
    return filtered;
  });
  
  // Methods
  const addToCart = (product) => {
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    
    // Bildirim göster
    addedProduct.value = product;
    showAddedNotification.value = true;
    
    // 2 saniye sonra bildirimi kapat
    setTimeout(() => {
      showAddedNotification.value = false;
    }, 2000);
  };
  
  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
  };
  </script>
  
  <style scoped>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>