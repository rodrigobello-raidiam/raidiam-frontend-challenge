<template>
  <header class="header">
    <div class="header-content">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="14.5357" cy="7.99993" r="7.46429" fill="var(--teal)" />
            <circle
              cx="7.46429"
              cy="7.99993"
              r="7.46429"
              fill="var(--purple-primary)"
              fill-opacity="0.4"
            />
          </svg>
        </span>
        <h1 class="logo-text">Shop</h1>
      </RouterLink>

      <div class="header-actions">
        <RouterLink to="/cart" class="cart-link" aria-label="View cart">
          <span class="cart-icon">
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.922 5.94113L11.5812 0L10.0188 0.907127L12.8493 5.94113H5.1507L7.9812 0.908041L6.4188 0L3.078 5.94113H0V7.77002H1.0782L2.7216 15.284C2.8125 15.7028 3.1779 16 3.6 16H14.4C14.8221 16 15.1875 15.7028 15.2784 15.284L16.9218 7.77002H18V5.94113H14.922ZM6.3 13.2567H4.5V8.68446H6.3V13.2567ZM9.9 13.2567H8.1V8.68446H9.9V13.2567ZM13.5 13.2567H11.7V8.68446H13.5V13.2567Z"
                fill="var(--gray-secondary)"
              />
            </svg>
          </span>
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
        <button class="sign-in-btn">Sign In</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid var(--gray-tertiary);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.cart-link {
  position: relative;
  text-decoration: none;
  color: var(--gray-primary);
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--error);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.sign-in-btn {
  font-size: 16px;
  padding: 8px 22px;
  background: var(--purple-primary);
  border-radius: 16px;
  border: none;
  color: var(--white);
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 10px;
  }
}

.logo-text {
  color: var(--gray-primary);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>
