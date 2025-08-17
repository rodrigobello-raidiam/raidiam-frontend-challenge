<template>
  <div class="product-details">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadProduct" class="retry-btn">Try Again</button>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <button @click="goBack" class="back-btn" aria-label="Go back">←</button>
        <span class="breadcrumb-text">
          {{ product.category.name }} / {{ product.category.name }}
        </span>
      </nav>

      <div class="product-layout">
        <!-- Product Images -->

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>

          <div class="product-meta">
            <p class="product-price">${{ product.price.toFixed(2) }}</p>
            <div class="product-rating">
              <span class="stars">
                <span v-for="i in 5" :key="i" class="star">
                  {{ i <= Math.floor(product.rating || 0) ? '★' : '☆' }}
                </span>
              </span>
              <span class="rating-text"
                >{{ product.rating || 0 }}/5.0 ({{
                  Math.floor(Math.random() * 1000)
                }})</span
              >
            </div>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- Quantity and Add to Cart -->
          <div class="add-to-cart-section">
            <div class="quantity-selector">
              <button
                @click="decreaseQuantity"
                class="quantity-btn"
                :disabled="quantity <= 1"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span class="quantity">{{ quantity }}</span>
              <button
                @click="increaseQuantity"
                class="quantity-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              @click="addToCart"
              class="add-to-cart-btn"
              :disabled="loading"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div class="product-images">
          <div class="main-image">
            <img :src="product.images[0]" :alt="product.title" />
          </div>
          <div class="thumbnail-images">
            <div
              v-for="(image, index) in product.images.slice(0, 3)"
              :key="index"
              class="thumbnail"
            >
              <img
                :src="image"
                :alt="`${product.title} - Image ${index + 1}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api.ts';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types';

interface Props {
  id: string | number;
}

const props = defineProps<Props>();

const router = useRouter();
const cartStore = useCartStore();

// State
const product = ref<Product | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const quantity = ref(1);

// Methods
const loadProduct = async (): Promise<void> => {
  loading.value = true;
  error.value = null;

  try {
    product.value = await api.getProduct(props.id);
  } catch (err) {
    error.value = 'Failed to load product. Please try again.';
    console.error('Error loading product:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = (): void => {
  router.back();
};

const increaseQuantity = (): void => {
  quantity.value++;
};

const decreaseQuantity = (): void => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = (): void => {
  if (product.value) {
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value);
    }

    // Show success feedback (you could add a toast notification here)
    console.log(`Added ${quantity.value} ${product.value.title} to cart`);
  }
};

// Lifecycle
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-details {
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 4rem 2rem;
  color: #ef4444;
}

.retry-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #5855eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #f3f4f6;
}

.breadcrumb-text {
  color: #666;
  font-size: 0.875rem;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-images {
  display: flex;
  gap: 1rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.product-price {
  margin: 0;
  color: #17183b;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0.15px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #fbbf24;
  font-size: 1rem;
}

.rating-text {
  font-size: 0.875rem;
  color: #666;
}

.product-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

.add-to-cart-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  background: white;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  padding: 0.75rem 1rem;
  background: white;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.add-to-cart-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #5855eb;
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .add-to-cart-section {
    flex-direction: column;
    align-items: stretch;
  }

  .product-features {
    flex-wrap: wrap;
  }
}
</style>
