<template>
    <div>
      <h2>Edit Product</h2>
      <form @submit.prevent="updateProduct">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" class="form-control" v-model="product.name" disabled />
        </div>
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <input type="text" id="category" class="form-control" v-model="product.category_id" />
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" id="price" class="form-control" v-model="product.unit_price" />
        </div>
        <div class="mb-3">
          <label for="weight" class="form-label">Weight</label>
          <input type="number" id="weight" class="form-control" v-model="product.unit_weight" />
        </div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: {
          id: '',
          name: '',
          category_id: '',
          unit_price: '',
          unit_weight: ''
        }
      };
    },
    async created() {
      const productId = this.$route.params.id;
      const response = await fetch(`/api/products/${productId}`);
      this.product = await response.json();
    },
    methods: {
      async updateProduct() {
        // Validate input
        if (!this.product.category_id || !this.product.unit_price || !this.product.unit_weight) {
          alert("All fields are required.");
          return;
        }
  
        if (this.product.unit_price <= 0) {
          alert("Price must be greater than zero.");
          return;
        }
  
        if (this.product.unit_weight <= 0) {
          alert("Weight must be greater than zero.");
          return;
        }
  
        const response = await fetch(`/api/products/${this.product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.product),
        });
  
        if (response.ok) {
          alert('Product updated successfully.');
        } else {
          const error = await response.json();
          alert(`Error updating product: ${error.message}`);
        }
      }
    }
  };
  </script>
  
  <style>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  </style>
  