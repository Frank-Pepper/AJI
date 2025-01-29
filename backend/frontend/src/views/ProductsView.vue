<template>
  <div>
    <h2>Products</h2>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Product ID</th>
          <th scope="col">Name</th>
          <th scope="col">Price</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.unit_price }} zł</td>
          <td>
            <router-link :to="'/products/' + product.id" class="btn btn-primary">View Details</router-link>
          </td>
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
    };
  },
  async created() {
    const response = await fetch('/api/products');
    this.products = await response.json();
  },
};
</script>
