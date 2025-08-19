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
        <button @click="goBack" class="back-btn" aria-label="Go back">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="var(--gray-secondary)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div class="breadcrumb-text">
          <span class="breadcrumb-link">{{ product.category.name }}</span>
          <span class="breadcrumb-separator"> / </span>
          <span class="breadcrumb-current">{{ product.category.name }}</span>
        </div>
      </nav>

      <div class="product-layout">
        <!-- Product Images -->

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>

          <div class="product-meta">
            <p class="product-price">${{ product.price }}</p>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- Quantity and Add to Cart -->
          <div class="add-to-cart-section" @click="addToCart">
            <div class="quantity-selector">
              <button
                @click="decreaseQuantity"
                class="quantity-btn"
                :disabled="quantity <= 1"
                aria-label="Decrease quantity"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H9"
                    stroke="var(--gray-secondary)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <span class="quantity">{{ quantity }}</span>
              <button
                @click="increaseQuantity"
                class="quantity-btn"
                aria-label="Increase quantity"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3V9M3 6H9"
                    stroke="var(--gray-secondary)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
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
  border: 4px solid var(--gray-quaternary);
  border-top: 4px solid var(--purple-primary);
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
  color: var(--error);
}

.retry-btn {
  background: var(--purple-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: var(--purple-secondary);
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
  cursor: pointer;
  color: var(--gray-secondary);
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: var(--gray-quaternary);
}

.breadcrumb-text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: var(--gray-secondary);
  cursor: pointer;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--gray-secondary);
}

.breadcrumb-current {
  color: var(--purple-primary);
  font-weight: 600;
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
  background: var(--surface);
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
  background: var(--surface);
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
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 56px;
  color: var(--gray-primary);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.product-price {
  margin: 0;
  color: var(--gray-primary);
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
  color: var(--warning);
  font-size: 1rem;
}

.rating-text {
  font-size: 0.875rem;
  color: var(--gray-secondary);
}

.product-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--gray-secondary);
}

.add-to-cart-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-tertiary);
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  background: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--gray-quaternary);
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
  color: var(--gray-secondary);
}

.add-to-cart-btn {
  font-size: 16px;
  font-weight: 500;
  padding: 16px 40px;
  background: var(--purple-primary);
  border-radius: 16px;
  border: none;
  color: var(--white);
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--purple-secondary);
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
