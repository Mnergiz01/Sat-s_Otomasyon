import { defineStore } from 'pinia';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useTableStore = defineStore('table', {
  state: () => ({
    tables: [],
    loading: false,
    error: null
  }),
  getters: {
    activeTables: (state) => {
      return state.tables.filter(table => table.status === 'active');
    },
    emptyTables: (state) => {
      return state.tables.filter(table => table.status === 'empty');
    }
  },
  actions: {
    async fetchTables() {
      this.loading = true;
      this.error = null;
      
      try {
        const tablesCollection = collection(db, 'tables');
        const tablesQuery = query(tablesCollection, orderBy('name'));
        const tablesSnapshot = await getDocs(tablesQuery);
        
        if (tablesSnapshot.empty) {
          // Eğer masa yoksa örnek masalar ekle
          await this.addSampleTables();
          return this.fetchTables();
        }
        
        this.tables = tablesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return this.tables;
      } catch (error) {
        console.error("Error fetching tables:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addTable(tableName) {
      this.loading = true;
      this.error = null;
      
      try {
        const newTable = {
          name: tableName,
          status: 'empty',
          items: [],
          total: 0
        };
        
        const tablesCollection = collection(db, 'tables');
        const docRef = await addDoc(tablesCollection, newTable);
        
        const addedTable = {
          id: docRef.id,
          ...newTable
        };
        
        this.tables.push(addedTable);
        
        return addedTable;
      } catch (error) {
        console.error("Error adding table:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addItemsToTable(tableId, items) {
      this.loading = true;
      this.error = null;
      
      try {
        const tableRef = doc(db, 'tables', tableId);
        const tableDoc = await getDoc(tableRef);
        
        if (!tableDoc.exists()) {
          throw new Error('Masa bulunamadı');
        }
        
        const tableData = tableDoc.data();
        let updatedItems = [...tableData.items];
        
        // Mevcut ürünleri güncelle veya yenilerini ekle
        for (const newItem of items) {
          const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
          
          if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            updatedItems.push(newItem);
          }
        }
        
        // Yeni toplam hesapla
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Masayı güncelle
        await updateDoc(tableRef, {
          items: updatedItems,
          total,
          status: 'active'
        });
        
        // Yerel state'i güncelle
        const tableIndex = this.tables.findIndex(t => t.id === tableId);
        if (tableIndex >= 0) {
          this.tables[tableIndex] = {
            ...this.tables[tableIndex],
            items: updatedItems,
            total,
            status: 'active'
          };
        }
        
        return this.tables[tableIndex];
      } catch (error) {
        console.error("Error adding items to table:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async removeItemFromTable(tableId, itemId) {
      this.loading = true;
      this.error = null;
      
      try {
        const tableRef = doc(db, 'tables', tableId);
        const tableDoc = await getDoc(tableRef);
        
        if (!tableDoc.exists()) {
          throw new Error('Masa bulunamadı');
        }
        
        const tableData = tableDoc.data();
        const updatedItems = tableData.items.filter(item => item.id !== itemId);
        
        // Yeni toplam hesapla
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Durum belirle
        const status = updatedItems.length > 0 ? 'active' : 'empty';
        
        // Masayı güncelle
        await updateDoc(tableRef, {
          items: updatedItems,
          total,
          status
        });
        
        // Yerel state'i güncelle
        const tableIndex = this.tables.findIndex(t => t.id === tableId);
        if (tableIndex >= 0) {
          this.tables[tableIndex] = {
            ...this.tables[tableIndex],
            items: updatedItems,
            total,
            status
          };
        }
        
        return this.tables[tableIndex];
      } catch (error) {
        console.error("Error removing item from table:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async completeTableOrder(tableId) {
      this.loading = true;
      this.error = null;
      
      try {
        const tableRef = doc(db, 'tables', tableId);
        
        // Masayı güncelle
        await updateDoc(tableRef, {
          items: [],
          total: 0,
          status: 'empty'
        });
        
        // Yerel state'i güncelle
        const tableIndex = this.tables.findIndex(t => t.id === tableId);
        if (tableIndex >= 0) {
          this.tables[tableIndex] = {
            ...this.tables[tableIndex],
            items: [],
            total: 0,
            status: 'empty'
          };
        }
        
        return this.tables[tableIndex];
      } catch (error) {
        console.error("Error completing table order:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addSampleTables() {
      this.loading = true;
      this.error = null;
      
      try {
        const sampleTables = [
          { name: 'Masa 1', status: 'empty', items: [], total: 0 },
          { name: 'Masa 2', status: 'empty', items: [], total: 0 },
          { name: 'Masa 3', status: 'empty', items: [], total: 0 },
          { name: 'Masa 4', status: 'empty', items: [], total: 0 },
          { name: 'Masa 5', status: 'empty', items: [], total: 0 },
          { name: 'Masa 6', status: 'empty', items: [], total: 0 },
          { name: 'Masa 7', status: 'empty', items: [], total: 0 },
          { name: 'Masa 8', status: 'empty', items: [], total: 0 },
          { name: 'Masa 9', status: 'empty', items: [], total: 0 },
          { name: 'Masa 10', status: 'empty', items: [], total: 0 },
          { name: 'Masa 11', status: 'empty', items: [], total: 0 },
          { name: 'Masa 12', status: 'empty', items: [], total: 0 },
          { name: 'Bahçe 1', status: 'empty', items: [], total: 0 },
          { name: 'Bahçe 2', status: 'empty', items: [], total: 0 },
          { name: 'Bahçe 3', status: 'empty', items: [], total: 0 },
          { name: 'Bahçe 4', status: 'empty', items: [], total: 0 },
          { name: 'Teras 1', status: 'empty', items: [], total: 0 },
          { name: 'Teras 2', status: 'empty', items: [], total: 0 },
          { name: 'VIP 1', status: 'empty', items: [], total: 0 },
          { name: 'VIP 2', status: 'empty', items: [], total: 0 }
        ];
        
        const tablesCollection = collection(db, 'tables');
        
        // Tüm masaları ekle
        const promises = sampleTables.map(table => addDoc(tablesCollection, table));
        await Promise.all(promises);
        
        return true;
      } catch (error) {
        console.error("Error adding sample tables:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});