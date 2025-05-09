<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Masalar</h1>
      
      <!-- Masa Filtreleme -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button 
            @click="selectedFilter = 'all'"
            class="px-4 py-2 rounded-full text-sm transition-colors"
            :class="selectedFilter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            Tüm Masalar ({{ tableStore.tables.length }})
          </button>
          <button 
            @click="selectedFilter = 'active'"
            class="px-4 py-2 rounded-full text-sm transition-colors"
            :class="selectedFilter === 'active' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            Aktif Masalar ({{ tableStore.activeTables.length }})
          </button>
          <button 
            @click="selectedFilter = 'empty'"
            class="px-4 py-2 rounded-full text-sm transition-colors"
            :class="selectedFilter === 'empty' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            Boş Masalar ({{ tableStore.emptyTables.length }})
          </button>
        </div>
      </div>
      
      <!-- Masa Listesi -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <TableCard 
          v-for="table in filteredTables" 
          :key="table.id" 
          :table="table"
          :selected="selectedTable?.id === table.id"
          @select="selectTable"
        />
        
        <!-- Masa bulunamadı -->
        <div v-if="filteredTables.length === 0" class="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
          <p class="text-gray-500">Seçilen filtreye uygun masa bulunamadı.</p>
        </div>
      </div>
      
      <TableDetail 
        v-if="selectedTable" 
        :table="selectedTable"
        @open-product-selection="openProductSelection"
        @complete-order="completeOrder"
        @remove-item="removeItemFromTable"
      />
      
      <ProductSelectionModal
        v-if="showProductModal"
        :products="productStore.products"
        :selected-products="selectedProducts"
        @close="showProductModal = false"
        @increase="increaseQuantity"
        @decrease="decreaseQuantity"
        @add-products="addProductsToTable"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useTableStore } from '@/stores/table';
  import { useProductStore } from '@/stores/product';
  import TableCard from '@/components/TableCard.vue';
  import TableDetail from '@/components/TableDetail.vue';
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
  
  // Computed
  const filteredTables = computed(() => {
    switch (selectedFilter.value) {
      case 'active':
        return tableStore.activeTables;
      case 'empty':
        return tableStore.emptyTables;
      default:
        return tableStore.tables;
    }
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
  </script>