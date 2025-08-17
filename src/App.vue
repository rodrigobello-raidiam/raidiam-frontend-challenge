<template>
  <div id="app">
    <HeaderMenu />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderMenu from './components/HeaderMenu.vue';
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  main {
    padding: 10px;
  }
}
</style>
