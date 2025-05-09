<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Masa Yönetimi</h1>
        <button 
          @click="showAddTableModal = true" 
          class="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle class="h-5 w-5 mr-1" />
          Yeni Masa Ekle
        </button>
      </div>
      
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
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div 
          v-for="table in filteredTables" 
          :key="table.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold">{{ table.name }}</h2>
              <StatusBadge :status="table.status" />
            </div>
            <p v-if="table.status !== 'empty'" class="text-sm text-gray-600 mb-3">
              Toplam: {{ table.total.toFixed(2) }} ₺
            </p>
            <p v-else class="text-sm text-gray-500 mb-3">
              Bu masa şu anda boş
            </p>
            <div class="flex justify-between items-center">
              <router-link 
                :to="`/tables?id=${table.id}`" 
                class="text-primary hover:text-primary-dark"
              >
                <Eye class="h-5 w-5" />
              </router-link>
              <button 
                v-if="table.status === 'active'"
                @click="completeTableOrder(table.id)"
                class="text-green-500 hover:text-green-700"
              >
                <CheckCircle class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Masa bulunamadı -->
        <div v-if="filteredTables.length === 0" class="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
          <p class="text-gray-500">Seçilen filtreye uygun masa bulunamadı.</p>
        </div>
      </div>
      
      <!-- Yeni Masa Ekleme Modal -->
      <div v-if="showAddTableModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Yeni Masa Ekle</h2>
            <button @click="showAddTableModal = false" class="text-gray-500 hover:text-gray-700">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="addTable">
            <div class="mb-4">
              <label for="tableName" class="block text-sm font-medium text-gray-700 mb-1">Masa Adı</label>
              <input 
                type="text" 
                id="tableName" 
                v-model="newTableName" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Örn: Masa 13, Bahçe 5, VIP 3"
              />
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="showAddTableModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                :disabled="isAddingTable"
              >
                {{ isAddingTable ? 'Ekleniyor...' : 'Ekle' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { PlusCircle, X, Eye, CheckCircle } from 'lucide-vue-next';
  import { useTableStore } from '@/stores/table';
  import StatusBadge from '@/components/StatusBadge.vue';
  
  const tableStore = useTableStore();
  
  // State
  const selectedFilter = ref('all');
  const showAddTableModal = ref(false);
  const newTableName = ref('');
  const isAddingTable = ref(false);
  
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
  
  // Methods
  const addTable = async () => {
    if (!newTableName.value.trim()) return;
    
    try {
      isAddingTable.value = true;
      await tableStore.addTable(newTableName.value.trim());
      newTableName.value = '';
      showAddTableModal.value = false;
    } catch (error) {
      console.error('Error adding table:', error);
    } finally {
      isAddingTable.value = false;
    }
  };
  
  const completeTableOrder = async (tableId) => {
    try {
      await tableStore.completeTableOrder(tableId);
    } catch (error) {
      console.error('Error completing table order:', error);
    }
  };
  </script>