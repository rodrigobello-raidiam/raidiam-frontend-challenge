<template>
  <div class="cart">
    <h1 class="cart-title">Cart</h1>
    <p class="cart-subtitle">{{ cartStore.items.length }} ITEMS</p>

    <div class="cart-layout">
      <!-- Cart Items -->
      <div class="cart-items">
        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
          <RouterLink to="/" class="continue-shopping-btn"
            >Continue Shopping</RouterLink
          >
        </div>

        <div v-else class="items-list">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>

            <div class="item-details">
              <h3 class="item-title">{{ item.title }}</h3>

              <div class="item-quantity">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="quantity-btn"
                  :disabled="item.quantity <= 1"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div class="item-price">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </div>

            <button
              @click="cartStore.removeFromCart(item.id)"
              class="remove-btn"
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>

        <div class="summary-items">
          <div class="summary-item">
            <span>Price</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>

          <div class="summary-item">
            <span>Discount</span>
            <span>-${{ discount.toFixed(2) }}</span>
          </div>

          <div class="summary-item">
            <span>Shipping</span>
            <span class="free-shipping">Free</span>
          </div>

          <div class="summary-item">
            <span>Coupon Applied</span>
            <span>$0.00</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total">
          <span>TOTAL</span>
          <span>${{ finalTotal.toFixed(2) }}</span>
        </div>

        <div class="delivery-info">
          <span>Estimated Delivery by</span>
          <span>{{ estimatedDelivery }}</span>
        </div>

        <button
          @click="proceedToCheckout"
          class="proceed-btn"
          :disabled="cartStore.items.length === 0"
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

// Computed properties
const discount = computed(() => {
  return cartStore.totalPrice * 0.1; // 10% discount
});

const finalTotal = computed(() => {
  return cartStore.totalPrice - discount.value;
});

const estimatedDelivery = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days from now
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
});

// Methods
const proceedToCheckout = (): void => {
  // This would typically navigate to a checkout page
  alert('Proceeding to checkout...');
};
</script>

<style scoped>
.cart {
  min-height: 100vh;
}

.cart-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.cart-subtitle {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.continue-shopping-btn {
  display: inline-block;
  background: #6366f1;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.continue-shopping-btn:hover {
  background: #5855eb;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.item-quantity {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}

.quantity-btn {
  background: white;
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
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
  padding: 0.5rem 0.75rem;
  background: white;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  margin-left: auto;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  margin-left: 1rem;
}

.remove-btn:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.order-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.order-summary h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.free-shipping {
  color: #10b981;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 2rem;
}

.proceed-btn {
  width: 100%;
  background: #10b981;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.proceed-btn:hover:not(:disabled) {
  background: #059669;
}

.proceed-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .order-summary {
    position: static;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .item-price {
    margin-left: 0;
    width: 100%;
    text-align: right;
  }

  .remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .cart-items {
    padding: 1rem;
  }

  .order-summary {
    padding: 1rem;
  }
}
</style>
