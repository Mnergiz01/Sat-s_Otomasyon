<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Ürün Yönetimi</h1>
        <button 
          @click="openAddProductModal" 
          class="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle class="h-5 w-5 mr-1" />
          Yeni Ürün Ekle
        </button>
      </div>
      
      <!-- Arama ve Filtreleme -->
      <div class="mb-6 flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-1/2">
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
        
        <div class="w-full md:w-1/2">
          <div class="relative">
            <select 
              v-model="selectedCategory" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              <option value="all">Tüm Kategoriler</option>
              <option v-for="category in filteredCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Ürün Tablosu -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-full object-cover" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.price.toFixed(2) }} ₺
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editProduct(product)" 
                    class="text-primary hover:text-primary-dark mr-3"
                  >
                    <Edit2 class="h-5 w-5" />
                  </button>
                  <button 
                    @click="confirmDelete(product)" 
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </td>
              </tr>
              
              <!-- Sonuç bulunamadı -->
              <tr v-if="filteredProducts.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                  <Search class="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
                  <button @click="resetFilters" class="mt-2 text-primary hover:underline">
                    Filtreleri Sıfırla
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Ürün Ekleme/Düzenleme Modal -->
      <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">{{ isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}</h2>
            <button @click="closeProductModal" class="text-gray-500 hover:text-gray-700">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <ProductForm 
            :product="currentProduct" 
            :categories="productStore.uniqueCategories"
            :is-editing="isEditing"
            @submit="saveProduct"
            @cancel="closeProductModal"
          />
        </div>
      </div>
      
      <!-- Silme Onay Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div class="flex items-center mb-4 text-red-500">
            <AlertTriangle class="h-6 w-6 mr-2" />
            <h2 class="text-xl font-semibold">Ürün Silme</h2>
          </div>
          
          <p class="mb-6">
            <strong>{{ productToDelete?.name }}</strong> ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              @click="deleteProduct" 
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              :disabled="isDeleting"
            >
              {{ isDeleting ? 'Siliniyor...' : 'Sil' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { PlusCircle, Search, ChevronDown, Edit2, Trash2, X, AlertTriangle } from 'lucide-vue-next';
  import { useProductStore } from '../stores/product';
  import ProductForm from '../components/ProductForm.vue';
  
  const productStore = useProductStore();
  
  // State
  const searchQuery = ref('');
  const selectedCategory = ref('all');
  const showProductModal = ref(false);
  const showDeleteModal = ref(false);
  const isEditing = ref(false);
  const currentProduct = ref({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: ''
  });
  const productToDelete = ref(null);
  const isDeleting = ref(false);
  const isAddProductModalOpen = ref(false); // Define isAddProductModalOpen here
  
  // Computed
  const filteredCategories = computed(() => {
    return productStore.uniqueCategories;
  });
  
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
               product.description.toLowerCase().includes(query);
      });
    }
    
    return filtered;
  });
  
  // Methods
  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
  };
  
  const openAddProductModal = () => {
    isEditing.value = false;
    currentProduct.value = {
      name: '',
      description: '',
      price: 0,
      category: productStore.uniqueCategories.length > 0 ? productStore.uniqueCategories[0] : '',
      image: ''
    };
    showProductModal.value = true;
  };
  
  const editProduct = (product) => {
    isEditing.value = true;
    currentProduct.value = { ...product };
    showProductModal.value = true;
  };
  
  const closeProductModal = () => {
    showProductModal.value = false;
  };
  
  const saveProduct = async (productData) => {
    try {
      if (isEditing.value) {
        await productStore.updateProduct(currentProduct.value.id, productData);
      } else {
        await productStore.addProduct(productData);
      }
      closeProductModal();
    } catch (error) {
      console.error('Error saving product:', error);
      // Burada bir hata mesajı gösterilebilir
    }
  };
  
  const confirmDelete = (product) => {
    productToDelete.value = product;
    showDeleteModal.value = true;
  };
  
  const deleteProduct = async () => {
    if (!productToDelete.value) return;
    
    try {
      isDeleting.value = true;
      await productStore.deleteProduct(productToDelete.value.id);
      showDeleteModal.value = false;
    } catch (error) {
      console.error('Error deleting product:', error);
      // Burada bir hata mesajı gösterilebilir
    } finally {
      isDeleting.value = false;
      productToDelete.value = null;
    }
  };
  </script>