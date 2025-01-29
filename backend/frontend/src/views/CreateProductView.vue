<template>
    <div class="container mt-4">
      <h2>Create New Product</h2>
      <form @submit.prevent="createProduct">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" class="form-control" v-model="product.name" required />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" class="form-control" v-model="product.description" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label for="unit_price" class="form-label">Price</label>
          <input type="number" id="unit_price" class="form-control" v-model.number="product.unit_price" required />
        </div>
        <div class="mb-3">
          <label for="unit_weight" class="form-label">Weight</label>
          <input type="number" id="unit_weight" class="form-control" v-model.number="product.unit_weight" required />
        </div>
        <div class="mb-3">
          <label for="category_id" class="form-label">Category ID</label>
          <input type="number" id="category_id" class="form-control" v-model.number="product.category_id" required />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <div v-if="message" :class="{'alert-success': success, 'alert-danger': !success}" class="alert mt-3">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: {
          name: '',
          description: '',
          unit_price: 0,
          unit_weight: 0,
          category_id: 0,
        },
        message: '',
        success: false,
      };
    },
    methods: {
      async createProduct() {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.product),
          });
  
          const result = await response.json();
          this.message = result.message;
          this.success = response.ok;
          if (this.success) {
            this.resetForm();
          }
        } catch (error) {
          this.message = `Error: ${error.message}`;
          this.success = false;
        }
      },
      resetForm() {
        this.product = {
          name: '',
          description: '',
          unit_price: 0,
          unit_weight: 0,
          category_id: 0,
        };
      },
    },
  };
  </script>
  
  <style>
  .container {
    max-width: 800px;
  }
  .alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }
  .alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
  </style>
  