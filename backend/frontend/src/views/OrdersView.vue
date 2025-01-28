<template>
    <div>
      <h1>Your Orders</h1>
      <table class="table mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Confirmation Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.confirmation_date }}</td>
            <td>{{ order.status_id }}</td>
            <td><router-link :to="'/order/' + order.id" class="btn btn-primary">Details</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orders: [],
      };
    },
    async created() {
      const response = await fetch('/api/orders');
      this.orders = await response.json();
    },
  };
  </script>
  