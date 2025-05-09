<template>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea 
          id="description" 
          v-model="formData.description" 
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        ></textarea>
      </div>
      
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
        <input 
          type="number" 
          id="price" 
          v-model.number="formData.price" 
          min="0" 
          step="0.01" 
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <div class="relative">
          <select 
            id="category" 
            v-model="formData.category" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary appearance-none"
          >
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
            <option value="new">+ Yeni Kategori Ekle</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown class="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div v-if="formData.category === 'new'">
        <label for="newCategory" class="block text-sm font-medium text-gray-700 mb-1">Yeni Kategori</label>
        <input 
          type="text" 
          id="newCategory" 
          v-model="newCategory" 
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
        <input 
          type="text" 
          id="image" 
          v-model="formData.image" 
          placeholder="https://example.com/image.jpg"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
        <p class="mt-1 text-xs text-gray-500">Resim URL'si girilmezse rastgele bir resim kullanılacaktır.</p>
      </div>
      
      <div v-if="formData.image" class="mt-2">
        <p class="text-sm font-medium text-gray-700 mb-1">Önizleme</p>
        <img :src="formData.image" alt="Ürün önizleme" class="h-40 w-full object-cover rounded-md" />
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Ekle') }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { ChevronDown } from 'lucide-vue-next';
  
  const props = defineProps({
    product: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: ''
      })
    },
    categories: {
      type: Array,
      default: () => []
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const formData = ref({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: ''
  });
  
  const newCategory = ref('');
  const isSubmitting = ref(false);
  
  // Mevcut kategorileri filtrele ('all' kategorisini çıkar)
  const availableCategories = computed(() => {
    return props.categories.filter(category => category !== 'all');
  });
  
  // Form verilerini başlat
  onMounted(() => {
    formData.value = { ...props.product };
  });
  
  const submitForm = async () => {
    try {
      isSubmitting.value = true;
      
      // Eğer yeni kategori eklendiyse
      if (formData.value.category === 'new' && newCategory.value) {
        formData.value.category = newCategory.value;
      }
      
      // Eğer resim URL'si girilmediyse rastgele bir resim kullan
      if (!formData.value.image) {
        const randomId = Math.floor(Math.random() * 1000);
        formData.value.image = `https://picsum.photos/id/${randomId}/300/200`;
      }
      
      // Form verilerini gönder
      emit('submit', { ...formData.value });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>