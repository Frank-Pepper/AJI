<template>
    <div>
      <h1>Your Cart</h1>
      <table class="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.quantity * item.unit_price }}</td>
          </tr>
        </tbody>
      </table>
      <h3>Total: {{ cartTotal }}</h3>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cartItems: [],
      };
    },
    computed: {
      cartTotal() {
        return this.cartItems.reduce((total, item) => total + item.quantity * item.unit_price, 0);
      },
    },
    async created() {
      const response = await fetch('/api/cart');
      this.cartItems = await response.json();
    },
  };
  </script>
  