<template>
    <div>
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>{{ product.price }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: {},
      };
    },
    async created() {
      const productId = this.$route.params.id;
      const response = await fetch(`/api/products/${productId}`);
      this.product = await response.json();
    },
  };
  </script>
  