<template>
  <div>
    <h1>Products</h1>
    <input type="text" v-model="searchTerm" class="form-control" placeholder="Search by name" />
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
          <td>
            <router-link :to="'/products/' + product.id">{{ product.name }}</router-link>
          </td>
          <td>{{ product.description }}</td>
          <td>{{ product.unit_price }}</td>
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
      searchTerm: '',
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return product.name.includes(this.searchTerm);
      });
    },
  },
  async created() {
    const productsResponse = await fetch('/api/products');
    this.products = await productsResponse.json();
  },
  methods: {
    addToCart(product) {
      console.log('Added to cart:', product);
    },
  },
};
</script>
