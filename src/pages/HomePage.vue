<template>
  <div class="home">
    <!-- Search and Filters -->
    <div class="filters">
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for products"
          class="search-input"
          aria-label="Search products"
        />
      </div>

      <select
        v-model="selectedCategory"
        class="category-select"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
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

      <div v-else class="products-grid" data-testid="products-grid">
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
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(query)
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

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.125rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--purple-primary);
  box-shadow: 0 0 0 3px rgba(100, 109, 237, 0.1);
}

.category-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  min-width: 200px;
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
  border: 4px solid #f3f4f6;
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
  color: #ef4444;
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
  color: #666;
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
