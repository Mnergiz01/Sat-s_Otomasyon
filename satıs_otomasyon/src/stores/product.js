import { defineStore } from 'pinia';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    selectedCategory: 'all',
    loading: false,
    error: null
  }),
  getters: {
    filteredProducts: (state) => {
      if (state.selectedCategory === 'all') {
        return state.products;
      }
      return state.products.filter(product => product.category === state.selectedCategory);
    },
    // Benzersiz kategorileri al
    uniqueCategories: (state) => {
      const uniqueCategories = [...new Set(state.products.map(product => product.category))];
      return uniqueCategories;
    }
  },
  actions: {
    setSelectedCategory(category) {
      this.selectedCategory = category;
    },
    
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const productsCollection = collection(db, 'products');
        const productsQuery = query(productsCollection, orderBy('name'));
        const productsSnapshot = await getDocs(productsQuery);
        
        if (productsSnapshot.empty) {
          // Eğer ürün yoksa örnek ürünler ekle
          await this.addSampleProducts();
          return this.fetchProducts();
        }
        
        this.products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Kategorileri güncelle
        this.categories = ['all', ...this.uniqueCategories];
        
        return this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addProduct(product) {
      this.loading = true;
      this.error = null;
      
      try {
        // Sayısal değerleri doğru formatta kaydet
        const productToSave = {
          ...product,
          price: Number(product.price)
        };
        
        // Firestore'a ürün ekle
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, productToSave);
        
        // Yerel state'e ürün ekle
        const newProduct = {
          id: docRef.id,
          ...productToSave
        };
        
        this.products.push(newProduct);
        
        // Kategorileri güncelle
        if (!this.categories.includes(product.category) && product.category !== 'all') {
          this.categories.push(product.category);
        }
        
        return newProduct;
      } catch (error) {
        console.error("Error adding product:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProduct(productId, updatedProduct) {
      this.loading = true;
      this.error = null;
      
      try {
        // Sayısal değerleri doğru formatta kaydet
        const productToUpdate = {
          ...updatedProduct,
          price: Number(updatedProduct.price)
        };
        
        // Firestore'da ürünü güncelle
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, productToUpdate);
        
        // Yerel state'i güncelle
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...productToUpdate
          };
        }
        
        // Kategorileri güncelle
        this.categories = ['all', ...this.uniqueCategories];
        
        return {
          id: productId,
          ...productToUpdate
        };
      } catch (error) {
        console.error("Error updating product:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteProduct(productId) {
      this.loading = true;
      this.error = null;
      
      try {
        // Firestore'dan ürünü sil
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);
        
        // Yerel state'den ürünü sil
        this.products = this.products.filter(p => p.id !== productId);
        
        // Kategorileri güncelle
        this.categories = ['all', ...this.uniqueCategories];
        
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addSampleProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const sampleProducts = [
          {
            name: 'Türk Kahvesi',
            description: 'Geleneksel Türk Kahvesi',
            price: 15.00,
            image: 'https://picsum.photos/id/431/300/200',
            category: 'Sıcak İçecekler'
          },
          {
            name: 'Espresso',
            description: 'Yoğun İtalyan Espresso',
            price: 12.00,
            image: 'https://picsum.photos/id/766/300/200',
            category: 'Sıcak İçecekler'
          },
          {
            name: 'Cappuccino',
            description: 'Espresso, buhar ve süt köpüğü',
            price: 18.00,
            image: 'https://picsum.photos/id/425/300/200',
            category: 'Sıcak İçecekler'
          },
          {
            name: 'Latte',
            description: 'Espresso ve buharla ısıtılmış süt',
            price: 20.00,
            image: 'https://picsum.photos/id/493/300/200',
            category: 'Sıcak İçecekler'
          },
          {
            name: 'Soğuk Kahve',
            description: 'Buzlu soğuk kahve',
            price: 22.00,
            image: 'https://picsum.photos/id/431/300/200',
            category: 'Soğuk İçecekler'
          },
          {
            name: 'Limonata',
            description: 'Ev yapımı limonata',
            price: 16.00,
            image: 'https://picsum.photos/id/667/300/200',
            category: 'Soğuk İçecekler'
          },
          {
            name: 'Cheesecake',
            description: 'Ev yapımı cheesecake',
            price: 25.00,
            image: 'https://picsum.photos/id/291/300/200',
            category: 'Tatlılar'
          },
          {
            name: 'Brownie',
            description: 'Sıcak çikolatalı brownie',
            price: 22.00,
            image: 'https://picsum.photos/id/835/300/200',
            category: 'Tatlılar'
          },
          {
            name: 'Sandviç',
            description: 'Tavuklu sandviç',
            price: 30.00,
            image: 'https://picsum.photos/id/294/300/200',
            category: 'Yiyecekler'
          },
          {
            name: 'Tost',
            description: 'Kaşarlı tost',
            price: 25.00,
            image: 'https://picsum.photos/id/312/300/200',
            category: 'Yiyecekler'
          }
        ];
        
        const productsCollection = collection(db, 'products');
        
        // Tüm ürünleri ekle
        const promises = sampleProducts.map(product => addDoc(productsCollection, product));
        await Promise.all(promises);
        
        return true;
      } catch (error) {
        console.error("Error adding sample products:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});