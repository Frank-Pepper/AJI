<template>
    <div class="container mt-4">
      <h2>Initialize Products</h2>
      <div class="mb-3">
        <label for="jsonInput" class="form-label">Product Data (JSON)</label>
        <textarea id="jsonInput" class="form-control" v-model="jsonInput" rows="10"></textarea>
      </div>
      <button class="btn btn-primary" @click="initializeProducts">Submit</button>
      <div v-if="message" :class="{'alert-success': success, 'alert-danger': !success}" class="alert mt-3">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        jsonInput: '',
        message: '',
        success: false,
      };
    },
    methods: {
      async initializeProducts() {
        try {
          const response = await fetch('/api/products/init', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: this.jsonInput,
          });
  
          const result = await response.json();
          this.message = result.message;
          this.success = response.ok;
        } catch (error) {
          this.message = `Error: ${error.message}`;
          this.success = false;
        }
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
  