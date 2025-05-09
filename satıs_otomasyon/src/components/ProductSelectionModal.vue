<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Ürün Seçimi</h2>
        <button 
          @click="$emit('close')" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X class="h-6 w-6" />
        </button>
      </div>
      
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row gap-4">
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
          <div class="relative w-full md:w-64">
            <select 
              v-model="selectedCategory" 
              class="appearance-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
            >
              <option value="all">Tüm Kategoriler</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <!-- Kategori Hızlı Erişim -->
        <div class="mt-4 overflow-x-auto pb-2 hide-scrollbar">
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
              v-for="category in uniqueCategories" 
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
      </div>
      
      <div class="flex flex-col md:flex-row flex-1 overflow-hidden">
        <!-- Ürün Listesi -->
        <div class="p-4 flex-1 overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="flex items-center p-3">
                <img 
                  :src="product.image" 
                  :alt="product.name" 
                  class="w-16 h-16 object-cover rounded-md mr-3"
                />
                <div class="flex-1">
                  <h3 class="font-medium mb-1">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ product.price.toFixed(2) }} ₺</p>
                  <div class="flex items-center">
                    <button 
                      @click="$emit('decrease', product)" 
                      class="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      :disabled="!getProductQuantity(product.id)"
                      :class="{'opacity-50 cursor-not-allowed': !getProductQuantity(product.id)}"
                    >
                      <Minus class="h-4 w-4" />
                    </button>
                    <span class="w-8 text-center">{{ getProductQuantity(product.id) }}</span>
                    <button 
                      @click="$emit('increase', product)" 
                      class="p-1 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      <Plus class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <button 
                    @click="quickAdd(product)" 
                    class="p-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    <Plus class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Ürün bulunamadı -->
            <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-8">
              <Search class="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p class="text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı.</p>
              <button @click="resetFilters" class="mt-2 text-primary hover:underline">
                Filtreleri Sıfırla
              </button>
            </div>
          </div>
        </div>
        
        <!-- Seçilen Ürünler -->
        <div class="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <h3 class="font-medium mb-4">Seçilen Ürünler</h3>
          
          <div v-if="hasSelectedProducts">
            <div 
              v-for="(quantity, productId) in selectedProducts" 
              :key="productId"
              v-show="quantity > 0"
              class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div class="flex items-center">
                <div class="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs mr-2 text-primary">
                  {{ quantity }}
                </div>
                <span>{{ getProductName(productId) }}</span>
              </div>
              <div class="flex items-center">
                <span class="mr-2 text-sm">{{ (getProductPrice(productId) * quantity).toFixed(2) }} ₺</span>
                <button 
                  @click="removeProduct(productId)" 
                  class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600 dark:text-gray-300">Toplam:</span>
                <span class="font-bold">{{ totalPrice.toFixed(2) }} ₺</span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <ShoppingCart class="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p class="text-gray-500 dark:text-gray-400">Henüz ürün seçilmedi</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          İptal
        </button>
        <button 
          @click="$emit('add-products')" 
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
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
import { 
  X, 
  Plus, 
  Minus, 
  Search, 
  Trash2, 
  ShoppingCart, 
  ChevronDown 
} from 'lucide-vue-next';

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

// Ürün fiyatını al
const getProductPrice = (productId) => {
  const product = props.products.find(p => p.id === productId);
  return product ? product.price : 0;
};

// Ürünü kaldır
const removeProduct = (productId) => {
  const product = props.products.find(p => p.id === productId);
  if (product) {
    emit('decrease', product);
  }
};

// Hızlı ekleme
const quickAdd = (product) => {
  emit('increase', product);
};

// Filtreleri sıfırla
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
</style>