import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product, CartItem } from '@/types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isLoading = ref(false);

  const loadCart = (): void => {
    try {
      const savedCart = localStorage.getItem('cart:v1');
      if (savedCart) {
        items.value = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  let persistTimer: NodeJS.Timeout;
  const saveCart = (): void => {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      localStorage.setItem('cart:v1', JSON.stringify(items.value));
    }, 1000);
  };

  loadCart();

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  });

  const addToCart = (product: Product): void => {
    const existingItem = items.value.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: Math.round(product.price * 100),
        image: product.images[0],
        quantity: 1,
      });
    }

    saveCart();
  };

  const removeFromCart = (productId: number): void => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index > -1) {
      items.value.splice(index);
      saveCart();
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
        saveCart();
      }
    }
  };

  const clearCart = (): void => {
    items.value = [];
    saveCart();
  };

  return {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  };
});
