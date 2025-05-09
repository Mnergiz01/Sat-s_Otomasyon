<template>
 <div>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-primary text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold">Cafe Otomasyonu</router-link>
        <div class="flex items-center space-x-4">
          <router-link to="/" class="hover:text-primary-200 transition-colors">Ürünler</router-link>
          <router-link to="/tables" class="hover:text-primary-200 transition-colors">Masalar</router-link>
          <router-link to="/cart" class="relative hover:text-primary-200 transition-colors">
            <ShoppingCart class="h-6 w-6" />
            <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
          <div class="relative" ref="adminMenuRef">
            <button 
              @click="toggleAdminMenu" 
              class="flex items-center hover:text-primary-200 transition-colors"
            >
              <Settings class="h-6 w-6" />
            </button>
            <div 
              v-if="showAdminMenu" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <router-link 
                to="/admin/products" 
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                @click="showAdminMenu = false"
              >
                Ürün Yönetimi
              </router-link>
              <router-link 
                to="/admin/tables" 
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                @click="showAdminMenu = false"
              >
                Masa Yönetimi
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <router-view />
    </div>
  </div>

  <!-- Loading Overlay -->
  <div v-if="appStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <p class="text-lg">Yükleniyor...</p>
    </div>
  </div>Ï
 </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { ShoppingCart, Settings } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/product';
import { useTableStore } from '@/stores/table';
import { useAppStore } from '@/stores/app';

// Store instances
const cartStore = useCartStore();
const productStore = useProductStore();
const tableStore = useTableStore();
const appStore = useAppStore();

// Admin menu
const showAdminMenu = ref(false);
const adminMenuRef = ref(null);

// Always define showCartBadge, even if it's initially false
const showCartBadge = ref(false);

const toggleAdminMenu = () => {
  showAdminMenu.value = !showAdminMenu.value;
};

// Menü dışına tıklandığında menüyü kapat
const handleClickOutside = (event) => {
  if (adminMenuRef.value && !adminMenuRef.value.contains(event.target)) {
    showAdminMenu.value = false;
  }
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  appStore.setLoading(true);
  try {
    await Promise.all([
      productStore.fetchProducts(),
      tableStore.fetchTables()
    ]);
  } catch (error) {
    console.error("Error loading initial data:", error);
  } finally {
    appStore.setLoading(false);
  }

  // Update showCartBadge after data is loaded
  showCartBadge.value = cartStore.totalItems > 0;
  
  // Dışarı tıklama olayını dinle
  
});

onUnmounted(() => {
  // Olay dinleyicisini temizle
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-primary-200: #c7d2fe;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-dark {
  background-color: var(--color-primary-dark);
}

.text-primary {
  color: var(--color-primary);
}

.text-primary-200 {
  color: var(--color-primary-200);
}

.border-primary {
  border-color: var(--color-primary);
}
</style>