<template>
  <div class="product-card" @click="navigateToProduct">
    <div class="product-image">
      <img :src="product.images[0]" :alt="product.title" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>

      <p class="product-price">${{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Product } from '../types';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const router = useRouter();

const navigateToProduct = (): void => {
  router.push(`/products/${props.product.id}`);
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1rem;
}

.product-title {
  margin: 0 0 0.5rem 0;
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  line-height: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  font-style: normal;
  color: var(--purple-primary);
}
</style>
