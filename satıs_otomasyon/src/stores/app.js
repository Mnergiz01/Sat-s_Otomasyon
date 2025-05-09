import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    darkMode: localStorage.getItem('theme') === 'dark',
    notifications: []
  }),
  actions: {
    setLoading(status) {
      this.loading = status;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    addNotification(notification) {
      this.notifications.push({
        id: Date.now(),
        ...notification,
        createdAt: new Date()
      });
      
      // 5 saniye sonra bildirimi kaldır
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }
});