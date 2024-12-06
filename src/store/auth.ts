// src/stores/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: ''
  }),
  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },
    clearTokens() {
      this.accessToken = '';
      this.refreshToken = '';
    }
  }
});
