<template>
<div>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo ve Başlık -->
          <div class="flex items-center space-x-2">
            <Coffee class="h-8 w-8 text-primary" />
            <router-link to="/" class="text-xl font-bold text-primary">CafePOS</router-link>
          </div>
          
          <!-- Ana Menü -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-md flex items-center space-x-1 transition-colors"
              :class="[$route.path === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            >
              <Coffee class="h-5 w-5" />
              <span>Ürünler</span>
            </router-link>
            
            <router-link 
              to="/tables" 
              class="px-4 py-2 rounded-md flex items-center space-x-1 transition-colors"
              :class="[$route.path.includes('/tables') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            >
              <LayoutGrid class="h-5 w-5" />
              <span>Masalar</span>
            </router-link>
            
            <router-link 
              to="/cart" 
              class="px-4 py-2 rounded-md flex items-center space-x-1 transition-colors relative"
              :class="[$route.path === '/cart' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            >
              <ShoppingCart class="h-5 w-5" />
              <span>Sepet</span>
              <span 
                v-if="cartStore.totalItems > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.totalItems }}
              </span>
            </router-link>
          </div>
          
          <!-- Sağ Menü -->
          <div class="flex items-center space-x-3">
            <!-- Tema Değiştirici -->
            <button 
              @click="toggleTheme" 
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sun v-if="isDarkMode" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </button>
            
            <!-- Admin Menü -->
            <div class="relative" ref="adminMenuRef">
              <button 
                @click="toggleAdminMenu" 
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings class="h-5 w-5" />
              </button>
              <div 
                v-if="showAdminMenu" 
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
              >
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium">Yönetim Paneli</p>
                </div>
                <router-link 
                  to="/admin/products" 
                  class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  @click="showAdminMenu = false"
                >
                  <Package class="h-4 w-4 mr-2" />
                  <span>Ürün Yönetimi</span>
                </router-link>
                <router-link 
                  to="/admin/tables" 
                  class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  @click="showAdminMenu = false"
                >
                  <LayoutGrid class="h-4 w-4 mr-2" />
                  <span>Masa Yönetimi</span>
                </router-link>
                <router-link 
                  to="/admin/categories" 
                  class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  @click="showAdminMenu = false"
                >
                  <Tags class="h-4 w-4 mr-2" />
                  <span>Kategori Yönetimi</span>
                </router-link>
                <div class="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                  <button 
                    class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500"
                    @click="showAdminMenu = false"
                  >
                    <LogOut class="h-4 w-4 mr-2" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Mobil Menü Butonu -->
            <button 
              @click="toggleMobileMenu" 
              class="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu v-if="!showMobileMenu" class="h-6 w-6" />
              <X v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <!-- Mobil Menü -->
        <div 
          v-if="showMobileMenu" 
          class="md:hidden mt-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1"
        >
          <router-link 
            to="/" 
            class="block px-4 py-2 rounded-md flex items-center space-x-2"
            :class="[$route.path === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            @click="showMobileMenu = false"
          >
            <Coffee class="h-5 w-5" />
            <span>Ürünler</span>
          </router-link>
          
          <router-link 
            to="/tables" 
            class="block px-4 py-2 rounded-md flex items-center space-x-2"
            :class="[$route.path.includes('/tables') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            @click="showMobileMenu = false"
          >
            <LayoutGrid class="h-5 w-5" />
            <span>Masalar</span>
          </router-link>
          
          <router-link 
            to="/cart" 
            class="block px-4 py-2 rounded-md flex items-center space-x-2 relative"
            :class="[$route.path === '/cart' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
            @click="showMobileMenu = false"
          >
            <ShoppingCart class="h-5 w-5" />
            <span>Sepet</span>
            <span 
              v-if="cartStore.totalItems > 0" 
              class="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Ana İçerik -->
    <div class="container mx-auto px-4 py-6">
      <router-view />
    </div>
    
    <!-- Durum Çubuğu -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 text-sm text-gray-600 dark:text-gray-400">
      <div class="container mx-auto flex justify-between items-center">
        <div>CafePOS v1.0</div>
        <div>{{ currentDate }}</div>
      </div>
    </footer>
  </div>

  <!-- Yükleniyor Ekranı -->
  <div v-if="appStore.loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-lg">Yükleniyor...</p>
    </div>
  </div>ƒ
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  Coffee, 
  ShoppingCart, 
  Settings, 
  Menu, 
  X, 
  LayoutGrid, 
  Package, 
  Tags, 
  LogOut,
  Sun,
  Moon
} from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/product';
import { useTableStore } from '@/stores/table';
import { useAppStore } from '@/stores/app';

// Store instances
const cartStore = useCartStore();
const productStore = useProductStore();
const tableStore = useTableStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

// State
const showAdminMenu = ref(false);
const showMobileMenu = ref(false);
const adminMenuRef = ref(null);
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Methods
const toggleAdminMenu = () => {
  showAdminMenu.value = !showAdminMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Menü dışına tıklandığında menüyü kapat
const handleClickOutside = (event) => {
  if (adminMenuRef.value && !adminMenuRef.value.contains(event.target)) {
    showAdminMenu.value = false;
  }
};

onMounted(async () => {
  // Tema ayarını uygula
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  }
  
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
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

:root {
  --color-primary: #10b981; /* Yeşil tonu - POS sistemleri için yaygın */
  --color-primary-dark: #059669;
  --color-primary-light: #d1fae5;
}

.dark {
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-primary-light: #064e3b;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-dark {
  background-color: var(--color-primary-dark);
}

.bg-primary-light {
  background-color: var(--color-primary-light);
}

.text-primary {
  color: var(--color-primary);
}

.border-primary {
  border-color: var(--color-primary);
}

.ring-primary {
  --tw-ring-color: var(--color-primary);
}

/* Animasyonlar */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Kaydırma çubuğu stilini özelleştir */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>