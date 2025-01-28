<template>
    <div>
      <h2>Product Details</h2>
      <div v-if="product">
        <p><strong>Product ID:</strong> {{ product.id }}</p>
        <p><strong>Name:</strong> {{ product.name }}</p>
        <p><strong>Description:</strong> {{ product.description }}</p>
        <p><strong>Price:</strong> {{ product.unit_price }}</p>
        <p><strong>Weight:</strong> {{ product.unit_weight }}</p>
        <p><strong>Category:</strong> {{ product.category_id }}</p>
        <router-link :to="'/edit-product/' + product.id" class="btn btn-primary mt-3">Edit Product</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: null,
      };
    },
    async created() {
      const productId = this.$route.params.id;
      const response = await fetch(`/api/products/${productId}`);
      this.product = await response.json();
    },
  };
  </script>
  