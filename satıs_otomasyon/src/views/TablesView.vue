<template>
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sol Panel: Masa Listesi -->
      <div class="w-full lg:w-2/3">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <!-- Üst Bilgi ve Filtreler -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 class="text-2xl font-bold">Masalar</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                {{ tableStore.tables.length }} masa, {{ tableStore.activeTables.length }} aktif
              </p>
            </div>
            
            <!-- Filtreler -->
            <div class="flex flex-wrap gap-2">
              <button 
                @click="selectedFilter = 'all'"
                class="px-4 py-2 rounded-full text-xs transition-colors"
                :class="selectedFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'"
              >
                Tüm Masalar ({{ tableStore.tables.length }})
              </button>
              <button 
                @click="selectedFilter = 'active'"
                class="px-4 py-2 rounded-full text-xs transition-colors"
                :class="selectedFilter === 'active' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'"
              >
                Aktif ({{ tableStore.activeTables.length }})
              </button>
              <button 
                @click="selectedFilter = 'empty'"
                class="px-4 py-2 rounded-full text-xs transition-colors"
                :class="selectedFilter === 'empty' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'"
              >
                Boş ({{ tableStore.emptyTables.length }})
              </button>
            </div>
          </div>
          
          <!-- Masa Arama -->
          <div class="mb-4">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Masa ara..." 
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
          </div>
          
          <!-- Masa Listesi -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            <div 
              v-for="table in filteredTables" 
              :key="table.id" 
              @click="selectTable(table)"
              class="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div 
                class="rounded-lg overflow-hidden border-2 h-full flex flex-col"
                :class="{
                  'border-primary bg-primary/5 dark:bg-primary/10': selectedTable?.id === table.id,
                  'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800': selectedTable?.id !== table.id,
                  'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20': table.status === 'active' && selectedTable?.id !== table.id,
                  'border-green-500 bg-green-50 dark:bg-green-900/20': table.status === 'empty' && selectedTable?.id !== table.id
                }"
              >
                <div class="p-3 flex flex-col h-full">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold">{{ table.name }}</h3>
                    <StatusBadge :status="table.status" />
                  </div>
                  
                  <div v-if="table.status === 'active'" class="mt-auto">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-500 dark:text-gray-400">{{ table.items.length }} ürün</span>
                      <span class="font-medium">{{ table.total.toFixed(2) }} ₺</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                      <div class="bg-yellow-500 h-full rounded-full" style="width: 100%;"></div>
                    </div>
                  </div>
                  
                  <div v-else class="mt-auto">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Bu masa şu anda boş</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Masa bulunamadı -->
            <div v-if="filteredTables.length === 0" class="col-span-full p-8 text-center">
              <Search class="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p class="text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun masa bulunamadı.</p>
              <button @click="resetFilters" class="mt-4 text-primary hover:underline">
                Filtreleri Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sağ Panel: Masa Detayı -->
      <div class="w-full lg:w-1/3">
        <div v-if="selectedTable" class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div class="flex items-center">
              <h2 class="text-xl font-semibold">{{ selectedTable.name }}</h2>
              <StatusBadge :status="selectedTable.status" class="ml-2" />
            </div>
            <div class="flex space-x-2">
              <button 
                @click="openProductSelection" 
                class="p-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                title="Ürün Ekle"
              >
                <Plus class="h-5 w-5" />
              </button>
              <button 
                v-if="selectedTable.status !== 'empty'" 
                @click="completeOrder" 
                class="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Siparişi Tamamla"
              >
                <CheckCircle class="h-5 w-5" />
              </button>
              <button 
                v-if="selectedTable.status !== 'empty'" 
                @click="printReceipt" 
                class="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Fiş Yazdır"
              >
                <Printer class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div v-if="selectedTable.status !== 'empty'" class="p-4">
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium">Sipariş Detayı</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ new Date().toLocaleTimeString('tr-TR') }}
                </span>
              </div>
              
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-[calc(100vh-350px)] overflow-y-auto">
                <div 
                  v-for="item in selectedTable.items" 
                  :key="item.id" 
                  class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div class="flex items-center">
                    <div class="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs mr-2">
                      {{ item.quantity }}
                    </div>
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="mr-4">{{ (item.price * item.quantity).toFixed(2) }} ₺</span>
                    <button 
                      @click="removeItemFromTable(item.id)" 
                      class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Toplam ve Butonlar -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-gray-600 dark:text-gray-300">Ara Toplam:</span>
                <span>{{ selectedTable.total.toFixed(2) }} ₺</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-gray-600 dark:text-gray-300">KDV (%8):</span>
                <span>{{ (selectedTable.total * 0.08).toFixed(2) }} ₺</span>
              </div>
              <div class="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Toplam:</span>
                <span>{{ (selectedTable.total * 1.08).toFixed(2) }} ₺</span>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <button 
                  @click="completeOrder" 
                  class="py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle class="h-5 w-5 mr-2" />
                  <span>Ödeme Al</span>
                </button>
                <button 
                  @click="printReceipt" 
                  class="py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Printer class="h-5 w-5 mr-2" />
                  <span>Fiş Yazdır</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="p-8 text-center">
            <Coffee class="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p class="text-gray-500 dark:text-gray-400">Bu masada henüz sipariş bulunmamaktadır.</p>
            <button 
              @click="openProductSelection" 
              class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center"
            >
              <PlusCircle class="h-5 w-5 mr-1" />
              Ürün Ekle
            </button>
          </div>
        </div>
        
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 text-center h-full flex flex-col items-center justify-center">
          <LayoutGrid class="h-12 w-12 text-gray-400 mb-2" />
          <p class="text-gray-500 dark:text-gray-400">Detaylarını görmek için bir masa seçin</p>
        </div>
      </div>
      
      <!-- Ürün Seçim Modalı -->
      <ProductSelectionModal
        v-if="showProductModal"
        :products="productStore.products"
        :selected-products="selectedProducts"
        @close="closeProductSelection"
        @increase="increaseQuantity"
        @decrease="decreaseQuantity"
        @add-products="addProductsToTable"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { 
    Search, 
    X, 
    Plus, 
    CheckCircle, 
    PlusCircle, 
    Trash2, 
    Coffee, 
    LayoutGrid,
    Printer
  } from 'lucide-vue-next';
  import { useTableStore } from '@/stores/table';
  import { useProductStore } from '@/stores/product';
  import StatusBadge from '@/components/StatusBadge.vue';
  import ProductSelectionModal from '@/components/ProductSelectionModal.vue';
  
  const route = useRoute();
  const router = useRouter();
  const tableStore = useTableStore();
  const productStore = useProductStore();
  
  // State
  const selectedTable = ref(null);
  const showProductModal = ref(false);
  const selectedProducts = ref({});
  const selectedFilter = ref('all');
  const searchQuery = ref('');
  
  // Computed
  const filteredTables = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    let filtered = [];
    
    // Filtre uygula
    switch (selectedFilter.value) {
      case 'active':
        filtered = tableStore.activeTables;
        break;
      case 'empty':
        filtered = tableStore.emptyTables;
        break;
      default:
        filtered = tableStore.tables;
    }
    
    // Arama filtresi
    if (query) {
      filtered = filtered.filter(table => {
        return table.name.toLowerCase().includes(query);
      });
    }
    
    return filtered;
  });
  
  // URL'den masa ID'sini al
  onMounted(async () => {
    await fetchInitialData();
  });
  
  const fetchInitialData = async () => {
    const tableId = route.query.id;
    if (tableId && tableStore.tables.length > 0) {
      const table = tableStore.tables.find(t => t.id === tableId);
      if (table) {
        selectedTable.value = table;
      }
    }
  };
  
  // Masalar yüklendiğinde URL'deki masa ID'sini kontrol et
  watch(() => tableStore.tables, async (newTables) => {
    await fetchInitialData();
  }, { immediate: true });
  
  // Masa seçildiğinde URL'yi güncelle
  const selectTable = (table) => {
    selectedTable.value = table;
    router.push({ query: { id: table.id } });
  };
  
  const openProductSelection = () => {
    selectedProducts.value = {};
    showProductModal.value = true;
  };
  
  const increaseQuantity = (product) => {
    if (!selectedProducts.value[product.id]) {
      selectedProducts.value[product.id] = 0;
    }
    selectedProducts.value[product.id]++;
  };
  
  const decreaseQuantity = (product) => {
    if (selectedProducts.value[product.id] && selectedProducts.value[product.id] > 0) {
      selectedProducts.value[product.id]--;
    }
  };
  
  const addProductsToTable = async () => {
    if (!selectedTable.value) return;
    
    const items = [];
    for (const [productId, quantity] of Object.entries(selectedProducts.value)) {
      if (quantity > 0) {
        const product = productStore.products.find(p => p.id === productId);
        if (product) {
          items.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity
          });
        }
      }
    }
    
    if (items.length > 0) {
      const updatedTable = await tableStore.addItemsToTable(selectedTable.value.id, items);
      selectedTable.value = updatedTable;
      showProductModal.value = false;
    }
  };
  
  const removeItemFromTable = async (itemId) => {
    if (!selectedTable.value) return;
    const updatedTable = await tableStore.removeItemFromTable(selectedTable.value.id, itemId);
    selectedTable.value = updatedTable;
  };
  
  const completeOrder = async () => {
    if (!selectedTable.value) return;
    const updatedTable = await tableStore.completeTableOrder(selectedTable.value.id);
    selectedTable.value = updatedTable;
  };
  
  const printReceipt = () => {
    // Fiş yazdırma işlevi (gerçek uygulamada yazıcı API'si kullanılabilir)
    alert(`${selectedTable.value.name} için fiş yazdırılıyor...`);
  };
  
  const resetFilters = () => {
    searchQuery.value = '';
    selectedFilter.value = 'all';
  };
  
  const closeProductSelection = () => {
    showProductModal.value = false;
  }
  </script>