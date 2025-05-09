<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Ürün Seçimi</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
          <X class="h-6 w-6" />
        </button>
      </div>
      
      <!-- Kategori Filtreleme -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          <button 
            @click="selectedCategory = 'all'"
            class="px-3 py-1 rounded-full text-xs transition-colors"
            :class="selectedCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            Tümü
          </button>
          <button 
            v-for="category in uniqueCategories" 
            :key="category"
            @click="selectedCategory = category"
            class="px-3 py-1 rounded-full text-xs transition-colors"
            :class="selectedCategory === category 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- Arama -->
      <div class="mb-4">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Ürün ara..." 
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <!-- Ürün Listesi -->
      <div class="overflow-y-auto flex-grow">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50"
          >
            <div class="flex items-center">
              <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded-md mr-3" />
              <div>
                <h3 class="font-medium">{{ product.name }}</h3>
                <p class="text-sm text-gray-600">{{ product.price.toFixed(2) }} ₺</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="$emit('decrease', product)" 
                class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                :disabled="!getProductQuantity(product.id)"
                :class="{'opacity-50 cursor-not-allowed': !getProductQuantity(product.id)}"
              >
                <Minus class="h-4 w-4" />
              </button>
              <span class="w-6 text-center">{{ getProductQuantity(product.id) }}</span>
              <button 
                @click="$emit('increase', product)" 
                class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-dark"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Ürün bulunamadı -->
        <div v-if="filteredProducts.length === 0" class="text-center py-8">
          <Search class="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-500">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          <button @click="resetFilters" class="mt-2 text-primary hover:underline">
            Filtreleri Sıfırla
          </button>
        </div>
      </div>
      
      <!-- Seçilen Ürünler Özeti -->
      <div v-if="hasSelectedProducts" class="mt-4 pt-4 border-t">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Seçilen Ürünler</h3>
          <span class="text-sm text-gray-600">Toplam: {{ totalPrice.toFixed(2) }} ₺</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(quantity, productId) in selectedProducts" 
            :key="productId"
            v-show="quantity > 0"
            class="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
          >
            <span>{{ getProductName(productId) }} ({{ quantity }})</span>
            <button 
              @click="removeProduct(productId)" 
              class="ml-1 text-gray-500 hover:text-red-500"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
        <button 
          @click="$emit('add-products')" 
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          :disabled="!hasSelectedProducts"
          :class="{'opacity-50 cursor-not-allowed': !hasSelectedProducts}"
        >
          Ekle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, Plus, Minus, Search } from 'lucide-vue-next';

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  selectedProducts: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'increase', 'decrease', 'add-products']);

const searchQuery = ref('');
const selectedCategory = ref('all');

// Benzersiz kategorileri al
const uniqueCategories = computed(() => {
  return [...new Set(props.products.map(product => product.category))];
});

// Filtrelenmiş ürünler
const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  let filtered = props.products;
  
  // Kategori filtresi
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }
  
  // Arama filtresi
  if (query) {
    filtered = filtered.filter(product => {
      return product.name.toLowerCase().includes(query) || 
             product.description.toLowerCase().includes(query);
    });
  }
  
  return filtered;
});

// Seçilen ürünlerin toplam fiyatı
const totalPrice = computed(() => {
  let total = 0;
  for (const [productId, quantity] of Object.entries(props.selectedProducts)) {
    if (quantity > 0) {
      const product = props.products.find(p => p.id === productId);
      if (product) {
        total += product.price * quantity;
      }
    }
  }
  return total;
});

// Seçili ürün var mı?
const hasSelectedProducts = computed(() => {
  return Object.values(props.selectedProducts).some(quantity => quantity > 0);
});

// Ürün miktarını al
const getProductQuantity = (productId) => {
  return props.selectedProducts[productId] || 0;
};

// Ürün adını al
const getProductName = (productId) => {
  const product = props.products.find(p => p.id === productId);
  return product ? product.name : '';
};

// Ürünü kaldır
const removeProduct = (productId) => {
  const product = props.products.find(p => p.id === productId);
  if (product) {
    emit('decrease', product);
  }
};

// Filtreleri sıfırla
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
};
</script>