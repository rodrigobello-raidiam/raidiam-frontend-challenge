<template>
  <div class="home">
    <!-- Search and Filters -->
    <div class="filters">
      <div class="search-container">
        <svg
          class="search-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.91667 0.5C7.35326 0.5 8.73101 1.07068 9.74683 2.0865C10.7627 3.10233 11.3333 4.48008 11.3333 5.91667C11.3333 7.25833 10.8417 8.49167 10.0333 9.44167L10.2583 9.66667H10.9167L15.0833 13.8333L13.8333 15.0833L9.66667 10.9167V10.2583L9.44167 10.0333C8.49167 10.8417 7.25833 11.3333 5.91667 11.3333C4.48008 11.3333 3.10233 10.7627 2.0865 9.74683C1.07068 8.73101 0.5 7.35326 0.5 5.91667C0.5 4.48008 1.07068 3.10233 2.0865 2.0865C3.10233 1.07068 4.48008 0.5 5.91667 0.5ZM5.91667 2.16667C3.83333 2.16667 2.16667 3.83333 2.16667 5.91667C2.16667 8 3.83333 9.66667 5.91667 9.66667C8 9.66667 9.66667 8 9.66667 5.91667C9.66667 3.83333 8 2.16667 5.91667 2.16667Z"
            fill="var(--gray-secondary)"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for products"
          class="search-input"
          aria-label="Search products"
        />
      </div>

      <div class="category-container">
        <svg
          class="category-arrow"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="var(--gray-secondary)"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <select
          v-model="selectedCategory"
          class="category-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadProducts" class="retry-btn">Try Again</button>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-container">
      <div v-if="filteredProducts.length === 0" class="no-results">
        <p>No products found matching your criteria.</p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api.ts';
import ProductCard from '../components/ProductCard.vue';
import type { Product, Category } from '../types';

const route = useRoute();
const router = useRouter();

// State
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedCategory = ref<string>('');

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.title.includes(searchQuery.value)
    );
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(
      product => product.category.id === parseInt(selectedCategory.value)
    );
  }

  return filtered;
});

// Methods
const loadProducts = async (): Promise<void> => {
  loading.value = true;
  error.value = null;

  try {
    const [productsData, categoriesData] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]);

    products.value = productsData;
    categories.value = categoriesData;
  } catch (err) {
    error.value = 'Failed to load products. Please try again.';
    console.error('Error loading products:', err);
  } finally {
    loading.value = false;
  }
};

const updateURL = (): void => {
  const query: Record<string, string> = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (selectedCategory.value) query.cat = selectedCategory.value;

  router.replace({ query });
};

const loadFromURL = (): void => {
  if (route.query.q) searchQuery.value = route.query.q as string;
  if (route.query.cat) selectedCategory.value = route.query.cat as string;
};

// Debounced search
let searchTimeout: NodeJS.Timeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(updateURL, 300);
});

watch(selectedCategory, updateURL);

// Lifecycle
onMounted(() => {
  loadFromURL();
  loadProducts();
});
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-input {
  display: flex;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  width: 100%;
  font-size: 16px;
  align-items: center;
  border-radius: 16px;
  background: var(--surface);
  color: var(--gray-primary);
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: var(--gray-primary) !important;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.category-container {
  position: relative;
  min-width: 200px;
}

.category-arrow {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none;
  z-index: 1;
}

.category-select {
  display: flex;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  width: 100%;
  font-size: 16px;
  align-items: center;
  border-radius: 16px;
  background: var(--surface);
  color: var(--gray-primary);
  border: none;
  outline: none;
  min-width: 200px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.category-select:focus {
  outline: none;
  border-color: var(--purple-primary);
  box-shadow: 0 0 0 3px rgba(100, 109, 237, 0.1);
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

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-secondary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .search-container {
    min-width: auto;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
