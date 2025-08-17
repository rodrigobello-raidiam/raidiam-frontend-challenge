import type { Product, Category } from '@/types';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    return this.get<Product[]>('/products');
  },

  async getProduct(id: string | number): Promise<Product> {
    return this.get<Product>(`/products/${id}`);
  },

  async getCategories(): Promise<Category[]> {
    return this.get<Category[]>('/categories');
  },
};
