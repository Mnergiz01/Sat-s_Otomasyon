<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Sepet</h1>
      
      <div v-if="cartStore.items.length > 0" class="bg-white rounded-lg shadow-md p-4">
        <CartTable 
          :items="cartStore.items" 
          :total="cartStore.total"
          @increase="increaseQuantity"
          @decrease="decreaseQuantity"
          @remove="removeItem"
        />
        
        <div class="mt-6 flex justify-between">
          <button @click="clearCart" class="border border-gray-300 px-4 py-2 rounded">
            Sepeti Temizle
          </button>
          <button @click="showTableSelection = true" class="bg-primary text-white px-4 py-2 rounded">
            Masaya Aktar
          </button>
        </div>
      </div>
      
      <EmptyCart v-else />
      
      <TableSelectionModal
        v-if="showTableSelection"
        :tables="tableStore.tables"
        :selected-table="selectedTable"
        @close="showTableSelection = false"
        @select="selectedTable = $event"
        @transfer="transferToTable"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCartStore } from '../stores/cart';
  import { useTableStore } from '../stores/table';
  import CartTable from '../components/CartTable.vue';
  import EmptyCart from '../components/EmptyCart.vue';
  import TableSelectionModal from '../components/TableSelectionModal.vue';
  
  const cartStore = useCartStore();
  const tableStore = useTableStore();
  const router = useRouter();
  
  const showTableSelection = ref(false);
  const selectedTable = ref(null);
  
  // Ensure useRouter is always called to prevent hook errors
  router;
  
  const increaseQuantity = (item) => {
    cartStore.updateItemQuantity(item.id, item.quantity + 1);
  };
  
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      cartStore.updateItemQuantity(item.id, item.quantity - 1);
    } else {
      cartStore.removeItem(item.id);
    }
  };
  
  const removeItem = (itemId) => {
    cartStore.removeItem(itemId);
  };
  
  const clearCart = () => {
    cartStore.clearCart();
  };
  
  const transferToTable = async () => {
    if (!selectedTable.value) return;
    
    const items = cartStore.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    await tableStore.addItemsToTable(selectedTable.value, items);
    cartStore.clearCart();
    showTableSelection.value = false;
    router.push('/tables');
  };
  </script>