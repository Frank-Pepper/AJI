<template>
  <div>
    <h1>Products</h1>
    <input type="text" v-model="searchTerm" class="form-control" placeholder="Search by name" />
    <select v-model="selectedCategory" class="form-control mt-2">
      <option value="">All Categories</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
    <table class="table mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td><button class="btn btn-primary" @click="addToCart(product)">Buy</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      categories: [],
      searchTerm: '',
      selectedCategory: '',
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return (
          product.name.includes(this.searchTerm) &&
          (this.selectedCategory === '' || product.categoryId === this.selectedCategory)
        );
      });
    },
  },
  async created() {
    const productsResponse = await fetch('/api/products');
    const categoriesResponse = await fetch('/api/categories');
    this.products = await productsResponse.json();
    this.categories = await categoriesResponse.json();
  },
  methods: {
    addToCart(product) {
      console.log('Added to cart:', product);
    },
  },
};
</script>
